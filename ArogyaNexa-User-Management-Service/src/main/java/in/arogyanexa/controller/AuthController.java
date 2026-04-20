package in.arogyanexa.controller;

 

 
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import in.arogyanexa.dto.ApiResponse;
import in.arogyanexa.dto.AuthResponse;
import in.arogyanexa.dto.ChangePasswordRequest;
import in.arogyanexa.dto.ForgotPasswordRequest;
import in.arogyanexa.dto.LoginRequest;
import in.arogyanexa.dto.RefreshTokenRequest;
import in.arogyanexa.dto.RegisterRequest;
import in.arogyanexa.dto.ResetPasswordRequest;
import in.arogyanexa.dto.UserProfileResponse;
import in.arogyanexa.service.AuthService;

/**
 * Authentication endpoints — all public except logout and change-password.
 *
 * POST /api/v1/auth/register
 * POST /api/v1/auth/login
 * POST /api/v1/auth/mfa/verify
 * POST /api/v1/auth/refresh
 * POST /api/v1/auth/logout
 * POST /api/v1/auth/forgot-password
 * POST /api/v1/auth/reset-password
 * POST /api/v1/auth/change-password
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/v1/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserProfileResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {

        log.info("[REGISTER] Incoming registration request | email={} | ip={}",
            maskEmail(request.getEmail()), getClientIp(httpRequest));

        UserProfileResponse profile = authService.register(request, httpRequest);

        log.info("[REGISTER] Registration successful | uuid={} | email={}",
            profile.getUuid(), maskEmail(profile.getEmail()));

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Registration successful. Please verify your email.", profile));
    }

    /**
     * POST /api/v1/auth/login
     *
     * If MFA is enabled and mfaCode is absent:
     *   → returns { mfaRequired: true, mfaSessionToken: "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        log.info("[LOGIN] Login attempt | email={} | ip={} | mfaCodeProvided={}",
            maskEmail(request.getEmail()),
            getClientIp(httpRequest),
            request.getMfaCode() != null && !request.getMfaCode().isBlank());

        AuthResponse response = authService.login(request, httpRequest);

        if (Boolean.TRUE.equals(response.getMfaRequired())) {
            log.info("[LOGIN] MFA required — session token issued | email={}",
                maskEmail(request.getEmail()));
        } else {
            log.info("[LOGIN] Login successful | uuid={} | roles={}",
                response.getUuid(), response.getRoles());
        }

        return ResponseEntity.ok(ApiResponse.success("Login successful.", response));
    }

    /**
     * POST /api/v1/auth/mfa/verify
     * Step 2 of 2-step MFA login.
     */
    @PostMapping("/mfa/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyMfa(
            @RequestParam String mfaSessionToken,
            @RequestParam String mfaCode,
            HttpServletRequest httpRequest) {

        log.info("[MFA_VERIFY] MFA verification attempt | ip={}", getClientIp(httpRequest));

        AuthResponse response = authService.verifyMfa(mfaSessionToken, mfaCode, httpRequest);

        log.info("[MFA_VERIFY] MFA verification successful | uuid={}", response.getUuid());

        return ResponseEntity.ok(ApiResponse.success("MFA verified. Login successful.", response));
    }

    /**
     * POST /api/v1/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpRequest) {

        log.debug("[TOKEN_REFRESH] Token refresh request | ip={}", getClientIp(httpRequest));

        AuthResponse response = authService.refreshToken(request, httpRequest);

        log.info("[TOKEN_REFRESH] Token refreshed successfully | uuid={}", response.getUuid());

        return ResponseEntity.ok(ApiResponse.success("Token refreshed.", response));
    }

    /**
     * POST /api/v1/auth/logout
     * Requires: Authorization: Bearer <token>
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal String userUuid,
            HttpServletRequest httpRequest) {

        log.info("[LOGOUT] Logout request | uuid={} | ip={}", userUuid, getClientIp(httpRequest));

        String token = extractToken(httpRequest);
        authService.logout(token, userUuid, httpRequest);

        log.info("[LOGOUT] Logout successful | uuid={}", userUuid);

        return ResponseEntity.ok(ApiResponse.success("Logged out successfully."));
    }

    /**
     * POST /api/v1/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpRequest) {

        // Log masked email — never log full email in password reset flows
        log.info("[FORGOT_PASSWORD] Password reset requested | email={} | ip={}",
            maskEmail(request.getEmail()), getClientIp(httpRequest));

        authService.forgotPassword(request, httpRequest);

        // Always 200 — prevents email enumeration
        log.debug("[FORGOT_PASSWORD] Reset flow completed (email existence not disclosed)");

        return ResponseEntity.ok(ApiResponse.success(
            "If that email is registered, a reset link has been sent."
        ));
    }

    /**
     * POST /api/v1/auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request,
            HttpServletRequest httpRequest) {

        log.info("[RESET_PASSWORD] Password reset attempt | ip={}", getClientIp(httpRequest));

        authService.resetPassword(request, httpRequest);

        log.info("[RESET_PASSWORD] Password reset completed successfully | ip={}",
            getClientIp(httpRequest));

        return ResponseEntity.ok(ApiResponse.success("Password reset successfully. Please login."));
    }

    /**
     * POST /api/v1/auth/change-password
     * Requires: Authorization: Bearer <token>
     */
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal String userUuid,
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest) {

        log.info("[CHANGE_PASSWORD] Password change request | uuid={} | ip={}",
            userUuid, getClientIp(httpRequest));

        authService.changePassword(userUuid, request, httpRequest);

        log.info("[CHANGE_PASSWORD] Password changed successfully | uuid={}", userUuid);

        return ResponseEntity.ok(ApiResponse.success("Password changed successfully. Please login again."));
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return "";
    }

    /**
     * Masks email for safe logging: john.doe@example.com → j***@example.com
     */
    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        String[] parts = email.split("@");
        String local = parts[0];
        String domain = parts[1];
        return (local.length() > 1 ? local.charAt(0) + "***" : "***") + "@" + domain;
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        return (xff != null && !xff.isBlank()) ? xff.split(",")[0].trim() : request.getRemoteAddr();
    }
}

