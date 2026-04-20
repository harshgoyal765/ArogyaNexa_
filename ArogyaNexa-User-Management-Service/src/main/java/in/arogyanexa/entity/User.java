package in.arogyanexa.entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    /**
     * 
     */
    @Serial
    private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(nullable = false, unique = true, updatable = false)
	private UUID uuid = UUID.randomUUID();

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "password_changed_at", nullable = false)
    private LocalDateTime passwordChangedAt;

    @Column(name = "is_enabled", nullable = false)
    @Builder.Default
    private boolean isEnabled = true;

    @Column(name = "is_account_non_locked", nullable = false)
    @Builder.Default
    private boolean isAccountNonLocked = true;

    @Column(name = "is_email_verified", nullable = false)
    @Builder.Default
    private boolean isEmailVerified = false;

    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "mfa_enabled", nullable = false)
    @Builder.Default
    private boolean mfaEnabled = false;

    // Stored encrypted — decrypted only when needed for TOTP verification
    @Column(name = "mfa_secret")
    private String mfaSecret;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (passwordChangedAt == null) {
            passwordChangedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── UserDetails implementation ────────────────────────────

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Add role-based authorities (ROLE_ prefix for Spring Security)
        roles.forEach(role ->
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()))
        );

        // Add permission-based authorities (fine-grained)
        roles.forEach(role ->
            role.getPermissions().forEach(permission ->
                authorities.add(new SimpleGrantedAuthority(permission.getName()))
            )
        );

        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Auto-unlock if lock duration has passed
        if (!isAccountNonLocked && lockedUntil != null) {
            return LocalDateTime.now().isAfter(lockedUntil);
        }
        return isAccountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Password expiry handled at service level
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }

    // ── Helpers ───────────────────────────────────────────────

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public Set<String> getRoleNames() {
        return roles.stream().map(Role::getName).collect(Collectors.toSet());
    }

    public boolean isPasswordExpired(int expiryDays) {
        return passwordChangedAt.plusDays(expiryDays).isBefore(LocalDateTime.now());
    }
}

