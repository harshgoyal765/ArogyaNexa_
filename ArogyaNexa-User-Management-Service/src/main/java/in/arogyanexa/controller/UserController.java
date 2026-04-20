package in.arogyanexa.controller;

 
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import in.arogyanexa.dto.ApiResponse;
import in.arogyanexa.dto.AssignRoleRequest;
import in.arogyanexa.dto.MfaSetupResponse;
import in.arogyanexa.dto.UserProfileResponse;
import in.arogyanexa.entity.User;
import in.arogyanexa.service.MfaService;
import in.arogyanexa.service.UserService;

/**
 * User management endpoints.
 *
 * GET    /api/v1/users/me
 * GET    /api/v1/users/{uuid}
 * PUT    /api/v1/users/{uuid}/roles
 * POST   /api/v1/users/{uuid}/enable
 * POST   /api/v1/users/{uuid}/disable
 * GET    /api/v1/users/mfa/setup
 * POST   /api/v1/users/mfa/enable
 * POST   /api/v1/users/mfa/disable
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final MfaService mfaService;

    public UserController(UserService userService, MfaService mfaService) {
        this.userService = userService;
        this.mfaService = mfaService;
    }

    /**
     * GET /api/v1/users/me — own profile
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal String userUuid) {

        log.debug("[PROFILE] Own profile requested | uuid={}", userUuid);

        UserProfileResponse profile = userService.getProfile(userUuid);

        log.debug("[PROFILE] Profile retrieved | uuid={} | roles={}", userUuid, profile.getRoles());

        return ResponseEntity.ok(ApiResponse.success("Profile retrieved.", profile));
    }

    /**
     * GET /api/v1/users/{uuid} — Admin/SuperAdmin only
     */
    @GetMapping("/{uuid}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(
            @PathVariable String uuid,
            @AuthenticationPrincipal String requestingUuid) {

        log.info("[PROFILE] Admin profile lookup | targetUuid={} | requestedBy={}",
            uuid, requestingUuid);

        UserProfileResponse profile = userService.getProfileByAdmin(uuid, requestingUuid);

        log.info("[PROFILE] Admin profile lookup successful | targetUuid={}", uuid);

        return ResponseEntity.ok(ApiResponse.success("Profile retrieved.", profile));
    }

    /**
     * PUT /api/v1/users/{uuid}/roles — SuperAdmin only
     */
    @PutMapping("/{uuid}/roles")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> assignRoles(
            @PathVariable String uuid,
            @Valid @RequestBody AssignRoleRequest request,
            @AuthenticationPrincipal String adminUuid) {

        log.info("[ROLE_ASSIGN] Role assignment request | targetUuid={} | roles={} | adminUuid={}",
            uuid, request.getRoles(), adminUuid);

        UserProfileResponse profile = userService.assignRoles(uuid, request, adminUuid);

        log.info("[ROLE_ASSIGN] Roles assigned successfully | targetUuid={} | assignedRoles={}",
            uuid, request.getRoles());

        return ResponseEntity.ok(ApiResponse.success("Roles assigned successfully.", profile));
    }

    /**
     * POST /api/v1/users/{uuid}/enable — Admin/SuperAdmin only
     */
    @PostMapping("/{uuid}/enable")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> enableUser(
            @PathVariable String uuid,
            @AuthenticationPrincipal String adminUuid) {

        log.info("[USER_ENABLE] Enable user request | targetUuid={} | adminUuid={}", uuid, adminUuid);

        userService.enableUser(uuid, adminUuid);

        log.info("[USER_ENABLE] User enabled | targetUuid={}", uuid);

        return ResponseEntity.ok(ApiResponse.success("User enabled."));
    }

    /**
     * POST /api/v1/users/{uuid}/disable — Admin/SuperAdmin only
     */
    @PostMapping("/{uuid}/disable")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> disableUser(
            @PathVariable String uuid,
            @AuthenticationPrincipal String adminUuid) {

        log.info("[USER_DISABLE] Disable user request | targetUuid={} | adminUuid={}", uuid, adminUuid);

        userService.disableUser(uuid, adminUuid);

        log.info("[USER_DISABLE] User disabled | targetUuid={}", uuid);

        return ResponseEntity.ok(ApiResponse.success("User disabled."));
    }

    // ── MFA endpoints ─────────────────────────────────────────────────────────

    /**
     * GET /api/v1/users/mfa/setup
     */
    @GetMapping("/mfa/setup")
    public ResponseEntity<ApiResponse<MfaSetupResponse>> getMfaSetup(
            @AuthenticationPrincipal String userUuid) {

        log.info("[MFA_SETUP] MFA setup initiated | uuid={}", userUuid);

        UserProfileResponse profile = userService.getProfile(userUuid);
        MfaSetupResponse setup = mfaService.generateMfaSetup(buildUserForMfa(profile));

        log.info("[MFA_SETUP] MFA setup data generated | uuid={}", userUuid);

        return ResponseEntity.ok(
            ApiResponse.success("Scan the QR code with your authenticator app.", setup)
        );
    }

    /**
     * POST /api/v1/users/mfa/enable
     */
    @PostMapping("/mfa/enable")
    public ResponseEntity<ApiResponse<Void>> enableMfa(
            @AuthenticationPrincipal String userUuid,
            @RequestParam String secret,
            @RequestParam String code) {

        log.info("[MFA_ENABLE] MFA enable request | uuid={}", userUuid);

        User user = getUserEntity(userUuid);
        mfaService.enableMfa(user, secret, code);

        log.info("[MFA_ENABLE] MFA enabled successfully | uuid={}", userUuid);

        return ResponseEntity.ok(ApiResponse.success("MFA enabled successfully."));
    }

    /**
     * POST /api/v1/users/mfa/disable
     */
    @PostMapping("/mfa/disable")
    public ResponseEntity<ApiResponse<Void>> disableMfa(
            @AuthenticationPrincipal String userUuid) {

        log.info("[MFA_DISABLE] MFA disable request | uuid={}", userUuid);

        User user = getUserEntity(userUuid);
        mfaService.disableMfa(user);

        log.info("[MFA_DISABLE] MFA disabled | uuid={}", userUuid);

        return ResponseEntity.ok(ApiResponse.success("MFA disabled."));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private  User buildUserForMfa(UserProfileResponse profile) {
        return  User.builder()
            .uuid(profile.getUuid())
            .email(profile.getEmail())
            .firstName(profile.getFirstName())
            .lastName(profile.getLastName())
            .build();
    }

    private User getUserEntity(String uuid) {
        return userService.loadUserEntity(uuid);
    }
}

