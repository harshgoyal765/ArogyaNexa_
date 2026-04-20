package in.arogyanexa.service;

 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import in.arogyanexa.dto.AssignRoleRequest;
import in.arogyanexa.dto.UserProfileResponse;
import in.arogyanexa.entity.Role;
import in.arogyanexa.entity.User;
import in.arogyanexa.exception.GlobalExceptionHandler;
import in.arogyanexa.exception.ResourceNotFoundException;
import in.arogyanexa.repository.*;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditService auditService;
    private final MfaService mfaService;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       AuditService auditService,
                       MfaService mfaService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.auditService = auditService;
        this.mfaService = mfaService;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String uuid) {
        log.debug("[PROFILE] Loading profile | uuid={}", uuid);
        User user = findByUuid(uuid);
        log.debug("[PROFILE] Profile loaded | uuid={} | roles={}", uuid, user.getRoleNames());
        return buildProfileResponse(user);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfileByAdmin(String targetUuid, String requestingUuid) {
        log.debug("[PROFILE] Admin lookup | targetUuid={} | requestedBy={}", targetUuid, requestingUuid);

        User requesting = findByUuid(requestingUuid);
        boolean isAdmin = requesting.getRoleNames().stream()
            .anyMatch(r -> r.equals("ADMIN") || r.equals("SUPER_ADMIN"));

        if (!isAdmin && !requestingUuid.equals(targetUuid)) {
            log.warn("[PROFILE] Access denied — non-admin tried to view another user | requestingUuid={} | targetUuid={}",
                requestingUuid, targetUuid);
            throw new AccessDeniedException("You can only view your own profile.");
        }

        UserProfileResponse profile = buildProfileResponse(findByUuid(targetUuid));
        log.debug("[PROFILE] Admin lookup successful | targetUuid={}", targetUuid);
        return profile;
    }

    @Transactional
    public UserProfileResponse assignRoles(String targetUuid, AssignRoleRequest request,
                                           String adminUuid) {
        log.info("[ROLE_ASSIGN] Assigning roles | targetUuid={} | roles={} | adminUuid={}",
            targetUuid, request.getRoles(), adminUuid);

        User user = findByUuid(targetUuid);
        Set<Role> roles = roleRepository.findByNameIn(request.getRoles());

        Set<String> foundNames = roles.stream().map(Role::getName).collect(Collectors.toSet());
        Set<String> notFound = request.getRoles().stream()
            .filter(r -> !foundNames.contains(r))
            .collect(Collectors.toSet());

        if (!notFound.isEmpty()) {
            log.warn("[ROLE_ASSIGN] Unknown roles requested | notFound={} | adminUuid={}", notFound, adminUuid);
            throw new ResourceNotFoundException("Roles not found: " + notFound);
        }

        Set<String> previousRoles = user.getRoleNames();
        user.setRoles(roles);
        userRepository.save(user);

        log.info("[ROLE_ASSIGN] Roles updated | targetUuid={} | before={} | after={} | adminUuid={}",
            targetUuid, previousRoles, request.getRoles(), adminUuid);

        auditService.log(
            user.getId(), "ROLES_ASSIGNED", "USER",
            "Roles: " + request.getRoles() + " by admin: " + adminUuid, "SUCCESS", null
        );

        return buildProfileResponse(user);
    }

    @Transactional
    public void enableUser(String uuid, String adminUuid) {
        log.info("[USER_ENABLE] Enabling user | uuid={} | adminUuid={}", uuid, adminUuid);
        User user = findByUuid(uuid);
        user.setEnabled(true);
        userRepository.save(user);
        log.info("[USER_ENABLE] User enabled | uuid={}", uuid);
        auditService.log(user.getId(), "USER_ENABLED", "USER", "By admin: " + adminUuid, "SUCCESS", null);
    }

    @Transactional
    public void disableUser(String uuid, String adminUuid) {
        log.info("[USER_DISABLE] Disabling user | uuid={} | adminUuid={}", uuid, adminUuid);
        User user = findByUuid(uuid);
        user.setEnabled(false);
        userRepository.save(user);
        log.info("[USER_DISABLE] User disabled | uuid={}", uuid);
        auditService.log(user.getId(), "USER_DISABLED", "USER", "By admin: " + adminUuid, "SUCCESS", null);
    }

    @Transactional(readOnly = true)
    public User loadUserEntity(String uuid) {
        log.debug("[USER_LOAD] Loading entity | uuid={}", uuid);
        return findByUuid(uuid);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private User findByUuid(String uuid) {
        return userRepository.findByUuid(UUID.fromString(uuid))
            .orElseThrow(() -> {
                log.warn("[USER_LOAD] User not found | uuid={}", uuid);
                return new ResourceNotFoundException("User not found: " + uuid);
            });
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
            .build();
    }

    // ── MFA Management ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public in.arogyanexa.dto.MfaSetupResponse generateMfaSetup(String uuid) {
        log.info("[MFA_SETUP] Generating MFA setup | uuid={}", uuid);
        User user = findByUuid(uuid);
        return mfaService.generateMfaSetup(user);
    }

    @Transactional
    public void enableMfa(String uuid, String secret, String code) {
        log.info("[MFA_ENABLE] Enabling MFA | uuid={}", uuid);
        User user = findByUuid(uuid);
        mfaService.enableMfa(user, secret, code);
        auditService.log(user.getId(), "MFA_ENABLED", "SUCCESS");
    }

    @Transactional
    public void disableMfa(String uuid) {
        log.info("[MFA_DISABLE] Disabling MFA | uuid={}", uuid);
        User user = findByUuid(uuid);
        mfaService.disableMfa(user);
        auditService.log(user.getId(), "MFA_DISABLED", "SUCCESS");
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(String uuid) {
        return getProfile(uuid);
    }
}
