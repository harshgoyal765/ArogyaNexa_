package in.arogyanexa.repository;

 

 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import in.arogyanexa.entity.User;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUuid(UUID uuid);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.id = :id")
    void incrementFailedAttempts(@Param("id") Long id);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = 0, u.isAccountNonLocked = true, u.lockedUntil = null WHERE u.id = :id")
    void resetFailedAttempts(@Param("id") Long id);

    @Modifying
    @Query("UPDATE User u SET u.isAccountNonLocked = false, u.lockedUntil = :lockedUntil WHERE u.id = :id")
    void lockAccount(@Param("id") Long id, @Param("lockedUntil") LocalDateTime lockedUntil);

    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginAt WHERE u.id = :id")
    void updateLastLogin(@Param("id") Long id, @Param("loginAt") LocalDateTime loginAt);

    @Modifying
    @Query("UPDATE User u SET u.passwordHash = :hash, u.passwordChangedAt = :changedAt WHERE u.id = :id")
    void updatePassword(@Param("id") Long id,
                        @Param("hash") String hash,
                        @Param("changedAt") LocalDateTime changedAt);
}

