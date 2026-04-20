package in.arogyanexa.service;

 
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import in.arogyanexa.dto.AuthResponse;
import in.arogyanexa.dto.ChangePasswordRequest;
import in.arogyanexa.dto.ForgotPasswordRequest;
import in.arogyanexa.dto.LoginRequest;
import in.arogyanexa.dto.RefreshTokenRequest;
import in.arogyanexa.dto.RegisterRequest;
import in.arogyanexa.dto.ResetPasswordRequest;
import in.arogyanexa.dto.UserProfileResponse;
import in.arogyanexa.entity.PasswordResetToken;
import in.arogyanexa.entity.RefreshToken;
import in.arogyanexa.entity.Role;
import in.arogyanexa.entity.User;
import in.arogyanexa.exception.AccountDisabledException;
import in.arogyanexa.exception.AccountLockedException;
import in.arogyanexa.exception.InvalidMfaCodeException;
import in.arogyanexa.exception.InvalidTokenException;
import in.arogyanexa.exception.PasswordExpiredException;
import in.arogyanexa.exception.PasswordMismatchException;
import in.arogyanexa.exception.PasswordReuseException;
import in.arogyanexa.exception.ResourceNotFoundException;
import in.arogyanexa.exception.UserAlreadyExistsException;
import in.arogyanexa.repository.*;
import in.arogyanexa.security.JwtTokenProvider;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService tokenBlacklistService;
    private final MfaService mfaService;
    private final EmailService emailService;
    private final AuditService auditService;

    @Value("${security.max-failed-attempts}")
    private int maxFailedAttempts;

    @Value("${security.lock-duration-minutes}")
    private int lockDurationMinutes;

    @Value("${security.password-expiry-days}")
    private int passwordExpiryDays;

    @Value("${security.password-reset-token-expiry-minutes}")
    private int resetTokenExpiryMinutes;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       JwtTokenProvider jwtTokenProvider,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       TokenBlacklistService tokenBlacklistService,
                       MfaService mfaService,
                       EmailService emailService,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenBlacklistService = tokenBlacklistService;
        this.mfaService = mfaService;
        this.emailService = emailService;
        this.auditService = auditService;
    }

    // ── Register ──────────────────────────────────────────────────────────────

    @Transactional
    public UserProfileResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        String email = request.getEmail().toLowerCase().trim();

        log.debug("[REGISTER] Duplicate check | email={}", maskEmail(email));

        if (userRepository.existsByEmail(email)) {
            log.warn("[REGISTER] Rejected — email already registered | email={}", maskEmail(email));
            throw new UserAlreadyExistsException("Email is already registered.");
        }
        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            log.warn("[REGISTER] Rejected — phone already registered");
            throw new UserAlreadyExistsException("Phone number is already registered.");
        }

        Role customerRole = roleRepository.findByName("CUSTOMER")
            .orElseThrow(() -> {
                log.error("[REGISTER] CRITICAL — CUSTOMER role missing from database");
                return new ResourceNotFoundException("Default role not found");
            });

        User user = User.builder()
            .uuid(UUID.randomUUID())
            .firstName(request.getFirstName().trim())
            .lastName(request.getLastName().trim())
            .email(email)
            .phone(request.getPhone())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .passwordChangedAt(LocalDateTime.now())
            .roles(Set.of(customerRole))
            .isEnabled(true)
            .isAccountNonLocked(true)
            .isEmailVerified(false)
            .build();

        userRepository.save(user);
        log.info("[REGISTER] User created | uuid={} | email={}", user.getUuid(), maskEmail(email));

        String verificationToken = UUID.randomUUID().toString();
        emailService.sendEmailVerification(user.getEmail(), user.getFirstName(), verificationToken);
        log.debug("[REGISTER] Verification email queued (async) | uuid={}", user.getUuid());

        auditService.log(user.getId(), "USER_REGISTERED", "SUCCESS");
        return buildProfileResponse(user);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String email = request.getEmail().toLowerCase().trim();
        String ip = extractIp(httpRequest);

        log.info("[LOGIN] Attempt | email={} | ip={}", maskEmail(email), ip);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                log.warn("[LOGIN] Failed — unknown email | email={} | ip={}", maskEmail(email), ip);
                auditService.log(null, "LOGIN_FAILED", "USER",
                    "Unknown email from ip=" + ip, "FAILURE", httpRequest);
                return new BadCredentialsException("Invalid email or password.");
            });

        log.debug("[LOGIN] User loaded | uuid={} | locked={} | failedAttempts={}",
            user.getUuid(), !user.isAccountNonLocked(), user.getFailedLoginAttempts());

        if (!user.isAccountNonLocked()) {
            log.warn("[LOGIN] Blocked — account locked | uuid={} | lockedUntil={} | ip={}",
                user.getUuid(), user.getLockedUntil(), ip);
            auditService.log(user.getId(), "LOGIN_BLOCKED", "FAILURE");
            throw new AccountLockedException(
                "Account is locked until " + user.getLockedUntil() + ". Please try again later."
            );
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
            log.debug("[LOGIN] Credentials verified | uuid={}", user.getUuid());
        } catch (BadCredentialsException ex) {
            log.warn("[LOGIN] Bad credentials | uuid={} | ip={}", user.getUuid(), ip);
            handleFailedLogin(user, httpRequest);
            throw new BadCredentialsException("Invalid email or password.");
        } catch (DisabledException ex) {
            log.warn("[LOGIN] Account disabled | uuid={} | ip={}", user.getUuid(), ip);
            throw new AccountDisabledException("Account is disabled. Please contact support.");
        } catch (LockedException ex) {
            log.warn("[LOGIN] Account locked (Spring) | uuid={} | ip={}", user.getUuid(), ip);
            throw new AccountLockedException("Account is locked. Please try again later.");
        }

        if (user.isPasswordExpired(passwordExpiryDays)) {
            log.warn("[LOGIN] Rejected — password expired | uuid={} | changedAt={}",
                user.getUuid(), user.getPasswordChangedAt());
            auditService.log(user.getId(), "LOGIN_PASSWORD_EXPIRED", "FAILURE");
            throw new PasswordExpiredException("Your password has expired. Please reset it.");
        }

        userRepository.resetFailedAttempts(user.getId());
        log.debug("[LOGIN] Failed attempts reset | uuid={}", user.getUuid());

        if (user.isMfaEnabled()) {
            if (request.getMfaCode() == null || request.getMfaCode().isBlank()) {
                log.info("[LOGIN] MFA required — session token issued | uuid={}", user.getUuid());
                String mfaSessionToken = jwtTokenProvider.generateMfaSessionToken(user.getUuid().toString());
                return AuthResponse.builder()
                    .mfaRequired(true)
                    .mfaSessionToken(mfaSessionToken)
                    .tokenType("Bearer")
                    .build();
            }
            if (!mfaService.verifyUserMfaCode(user, request.getMfaCode())) {
                log.warn("[LOGIN] MFA code invalid | uuid={} | ip={}", user.getUuid(), ip);
                auditService.log(user.getId(), "MFA_FAILED", "FAILURE");
                throw new InvalidMfaCodeException("Invalid MFA code.");
            }
            log.debug("[LOGIN] MFA code accepted | uuid={}", user.getUuid());
        }

        log.info("[LOGIN] Success | uuid={} | roles={}", user.getUuid(), user.getRoleNames());
        return issueTokens(user, httpRequest);
    }

    // ── MFA Verify ────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse verifyMfa(String mfaSessionToken, String mfaCode,
                                  HttpServletRequest httpRequest) {
        String ip = extractIp(httpRequest);
        log.debug("[MFA_VERIFY] Validating session token | ip={}", ip);

        if (!jwtTokenProvider.validateToken(mfaSessionToken)) {
            log.warn("[MFA_VERIFY] Invalid/expired session token | ip={}", ip);
            throw new InvalidTokenException("MFA session token is invalid or expired.");
        }

        String tokenType = jwtTokenProvider.extractTokenType(mfaSessionToken);
        if (!"MFA_SESSION".equals(tokenType)) {
            log.warn("[MFA_VERIFY] Wrong token type | type={} | ip={}", tokenType, ip);
            throw new InvalidTokenException("Invalid token type for MFA verification.");
        }

        String uuid = jwtTokenProvider.extractUuid(mfaSessionToken);
        log.debug("[MFA_VERIFY] Session token valid | uuid={}", uuid);

        User user = userRepository.findByUuid(UUID.fromString(uuid))
            .orElseThrow(() -> {
                log.error("[MFA_VERIFY] User not found for valid MFA token | uuid={}", uuid);
                return new ResourceNotFoundException("User not found.");
            });

        if (!mfaService.verifyUserMfaCode(user, mfaCode)) {
            log.warn("[MFA_VERIFY] Code invalid | uuid={} | ip={}", uuid, ip);
            auditService.log(user.getId(), "MFA_FAILED", "FAILURE");
            throw new InvalidMfaCodeException("Invalid MFA code.");
        }

        log.info("[MFA_VERIFY] Verified — issuing tokens | uuid={}", uuid);
        return issueTokens(user, httpRequest);
    }

    // ── Refresh Token ─────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request, HttpServletRequest httpRequest) {
        String ip = extractIp(httpRequest);
        log.debug("[TOKEN_REFRESH] Request | ip={}", ip);

        String tokenHash = jwtTokenProvider.hashToken(request.getRefreshToken());

        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
            .orElseThrow(() -> {
                log.warn("[TOKEN_REFRESH] Token not found in DB | ip={}", ip);
                return new InvalidTokenException("Refresh token not found.");
            });

        log.debug("[TOKEN_REFRESH] Token found | userId={} | revoked={} | expired={}",
            storedToken.getUser().getId(), storedToken.isRevoked(), storedToken.isExpired());

        if (!storedToken.isValid()) {
            log.warn("[TOKEN_REFRESH] Token invalid | userId={}", storedToken.getUser().getId());
            throw new InvalidTokenException("Refresh token is expired or revoked.");
        }

        User user = storedToken.getUser();
        storedToken.setRevoked(true);
        storedToken.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(storedToken);
        log.debug("[TOKEN_REFRESH] Old token revoked | uuid={}", user.getUuid());

        auditService.log(user.getId(), "TOKEN_REFRESHED", "SUCCESS");
        log.info("[TOKEN_REFRESH] Token rotated | uuid={}", user.getUuid());
        return issueTokens(user, httpRequest);
    }

    // ── Logout ────────────────────────────────────────────────────────────────

    @Transactional
    public void logout(String accessToken, String userUuid, HttpServletRequest httpRequest) {
        String ip = extractIp(httpRequest);
        log.info("[LOGOUT] Processing | uuid={} | ip={}", userUuid, ip);

        if (jwtTokenProvider.validateToken(accessToken)) {
            long ttl = jwtTokenProvider.getAccessTokenExpirySeconds();
            tokenBlacklistService.blacklist(accessToken, ttl);
            log.debug("[LOGOUT] Access token blacklisted | uuid={} | ttlSeconds={}", userUuid, ttl);
        } else {
            log.debug("[LOGOUT] Token already invalid — skipping blacklist | uuid={}", userUuid);
        }

        User user = userRepository.findByUuid(UUID.fromString(userUuid))
            .orElseThrow(() -> {
                log.error("[LOGOUT] User not found | uuid={}", userUuid);
                return new ResourceNotFoundException("User not found.");
            });

        refreshTokenRepository.revokeAllUserTokens(user.getId());
        log.info("[LOGOUT] All refresh tokens revoked | uuid={}", userUuid);

        auditService.log(user.getId(), "LOGOUT", "USER", null, "SUCCESS", httpRequest);
    }

    // ── Forgot Password ───────────────────────────────────────────────────────

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        String email = request.getEmail().toLowerCase().trim();
        String ip = extractIp(httpRequest);
        log.info("[FORGOT_PASSWORD] Reset requested | email={} | ip={}", maskEmail(email), ip);

        userRepository.findByEmail(email).ifPresent(user -> {
            log.debug("[FORGOT_PASSWORD] Generating reset token | uuid={}", user.getUuid());
            passwordResetTokenRepository.deleteExpiredTokens();

            String rawToken = UUID.randomUUID().toString();
            String tokenHash = jwtTokenProvider.hashToken(rawToken);

            PasswordResetToken resetToken = PasswordResetToken.builder()
                .tokenHash(tokenHash)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(resetTokenExpiryMinutes))
                .build();

            passwordResetTokenRepository.save(resetToken);
            log.debug("[FORGOT_PASSWORD] Token persisted | uuid={} | expiresAt={}",
                user.getUuid(), resetToken.getExpiresAt());

            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), rawToken);
            log.info("[FORGOT_PASSWORD] Reset email queued (async) | uuid={}", user.getUuid());

            auditService.log(user.getId(), "PASSWORD_RESET_REQUESTED", "SUCCESS");
        });

        log.debug("[FORGOT_PASSWORD] Flow complete (user existence not disclosed)");
    }

    // ── Reset Password ────────────────────────────────────────────────────────

    @Transactional
    public void resetPassword(ResetPasswordRequest request, HttpServletRequest httpRequest) {
        String ip = extractIp(httpRequest);
        log.info("[RESET_PASSWORD] Attempt | ip={}", ip);

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            log.warn("[RESET_PASSWORD] Password mismatch | ip={}", ip);
            throw new PasswordMismatchException("Passwords do not match.");
        }

        String tokenHash = jwtTokenProvider.hashToken(request.getToken());

        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
            .orElseThrow(() -> {
                log.warn("[RESET_PASSWORD] Token not found | ip={}", ip);
                return new InvalidTokenException("Reset token is invalid.");
            });

        log.debug("[RESET_PASSWORD] Token found | userId={} | used={} | expired={}",
            resetToken.getUser().getId(), resetToken.isUsed(), resetToken.isExpired());

        if (!resetToken.isValid()) {
            log.warn("[RESET_PASSWORD] Token expired or already used | userId={}",
                resetToken.getUser().getId());
            throw new InvalidTokenException("Reset token has expired or already been used.");
        }

        User user = resetToken.getUser();

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            log.warn("[RESET_PASSWORD] Password reuse attempt | uuid={}", user.getUuid());
            throw new PasswordReuseException("New password cannot be the same as the current password.");
        }

        userRepository.updatePassword(
            user.getId(),
            passwordEncoder.encode(request.getNewPassword()),
            LocalDateTime.now()
        );
        log.debug("[RESET_PASSWORD] Password updated | uuid={}", user.getUuid());

        passwordResetTokenRepository.markAsUsed(resetToken.getId());
        refreshTokenRepository.revokeAllUserTokens(user.getId());

        log.info("[RESET_PASSWORD] Complete — all sessions revoked | uuid={}", user.getUuid());
        auditService.log(user.getId(), "PASSWORD_RESET", "USER", null, "SUCCESS", httpRequest);
    }

    // ── Change Password ───────────────────────────────────────────────────────

    @Transactional
    public void changePassword(String userUuid, ChangePasswordRequest request,
                               HttpServletRequest httpRequest) {
        String ip = extractIp(httpRequest);
        log.info("[CHANGE_PASSWORD] Request | uuid={} | ip={}", userUuid, ip);

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            log.warn("[CHANGE_PASSWORD] Password mismatch | uuid={}", userUuid);
            throw new PasswordMismatchException("Passwords do not match.");
        }

        User user = userRepository.findByUuid(UUID.fromString(userUuid))
            .orElseThrow(() -> {
                log.error("[CHANGE_PASSWORD] User not found | uuid={}", userUuid);
                return new ResourceNotFoundException("User not found.");
            });

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            log.warn("[CHANGE_PASSWORD] Current password incorrect | uuid={} | ip={}", userUuid, ip);
            throw new BadCredentialsException("Current password is incorrect.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            log.warn("[CHANGE_PASSWORD] Password reuse attempt | uuid={}", userUuid);
            throw new PasswordReuseException("New password cannot be the same as the current password.");
        }

        userRepository.updatePassword(
            user.getId(),
            passwordEncoder.encode(request.getNewPassword()),
            LocalDateTime.now()
        );

        refreshTokenRepository.revokeAllUserTokens(user.getId());
        log.info("[CHANGE_PASSWORD] Password changed — all sessions revoked | uuid={}", userUuid);

        auditService.log(user.getId(), "PASSWORD_CHANGED", "USER", null, "SUCCESS", httpRequest);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private AuthResponse issueTokens(User user, HttpServletRequest httpRequest) {
        log.debug("[TOKEN_ISSUE] Generating tokens | uuid={}", user.getUuid());

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String rawRefreshToken = jwtTokenProvider.generateRefreshToken();

        RefreshToken refreshToken = RefreshToken.builder()
            .tokenHash(jwtTokenProvider.hashToken(rawRefreshToken))
            .user(user)
            .expiresAt(jwtTokenProvider.getRefreshTokenExpiry())
            .ipAddress(extractIp(httpRequest))
            .deviceInfo(httpRequest != null ? httpRequest.getHeader("User-Agent") : null)
            .build();

        refreshTokenRepository.save(refreshToken);
        userRepository.updateLastLogin(user.getId(), LocalDateTime.now());

        log.debug("[TOKEN_ISSUE] Tokens issued | uuid={} | refreshExpiresAt={}",
            user.getUuid(), refreshToken.getExpiresAt());

        auditService.log(user.getId(), "LOGIN_SUCCESS", "USER", null, "SUCCESS", httpRequest);

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(rawRefreshToken)
            .tokenType("Bearer")
            .expiresIn(jwtTokenProvider.getAccessTokenExpirySeconds())
            .uuid(UUID.randomUUID())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .roles(user.getRoleNames())
            .build();
    }

    private void handleFailedLogin(User user, HttpServletRequest httpRequest) {
        userRepository.incrementFailedAttempts(user.getId());
        int attempts = user.getFailedLoginAttempts() + 1;

        log.warn("[LOGIN] Failed attempt #{} | uuid={} | ip={}",
            attempts, user.getUuid(), extractIp(httpRequest));

        auditService.log(user.getId(), "LOGIN_FAILED",
            "USER", "Failed attempt #" + attempts, "FAILURE", httpRequest);

        if (attempts >= maxFailedAttempts) {
            LocalDateTime lockUntil = LocalDateTime.now().plusMinutes(lockDurationMinutes);
            userRepository.lockAccount(user.getId(), lockUntil);
            emailService.sendAccountLockedEmail(user.getEmail(), user.getFirstName(), lockDurationMinutes);
            log.warn("[LOGIN] Account LOCKED after {} attempts | uuid={} | lockedUntil={}",
                attempts, user.getUuid(), lockUntil);
        }
    }

    private UserProfileResponse buildProfileResponse(User user) {
        Set<String> permissions = user.getAuthorities().stream()
            .map(a -> a.getAuthority())
            .filter(a -> !a.startsWith("ROLE_"))
            .collect(Collectors.toSet());

        return UserProfileResponse.builder()
            .uuid(user.getUuid())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .mfaEnabled(user.isMfaEnabled())
            .emailVerified(user.isEmailVerified())
            .roles(user.getRoleNames())
            .permissions(permissions)
            .lastLoginAt(user.getLastLoginAt())
            .createdAt(user.getCreatedAt())
            .passwordExpired(user.isPasswordExpired(passwordExpiryDays))
            .build();
    }

    /** Masks email for safe logging: john@example.com -> j***@example.com */
    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        String[] parts = email.split("@");
        return (parts[0].length() > 1 ? parts[0].charAt(0) + "***" : "***") + "@" + parts[1];
    }

    private String extractIp(HttpServletRequest request) {
        if (request == null) return "unknown";
        String xff = request.getHeader("X-Forwarded-For");
        return (xff != null && !xff.isEmpty()) ? xff.split(",")[0].trim() : request.getRemoteAddr();
    }
}

