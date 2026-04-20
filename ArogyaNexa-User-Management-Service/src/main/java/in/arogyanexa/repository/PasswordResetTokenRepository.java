package in.arogyanexa.repository;

 

 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import in.arogyanexa.entity.PasswordResetToken;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.used = true, t.usedAt = CURRENT_TIMESTAMP WHERE t.id = :id")
    void markAsUsed(@Param("id") Long id);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiresAt < CURRENT_TIMESTAMP")
    void deleteExpiredTokens();
}
