package in.arogyanexa.service;

 

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import in.arogyanexa.dto.MfaSetupResponse;
import in.arogyanexa.entity.User;
import in.arogyanexa.exception.InvalidMfaCodeException;
import in.arogyanexa.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;

@Service
public class MfaService {

    private static final Logger log = LoggerFactory.getLogger(MfaService.class);

    private final UserRepository userRepository;

    @Value("${jwt.secret}")
    private String encryptionPassword;

    private static final String ENCRYPTION_SALT = "weshopify1234567";

    public MfaService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Generates a new TOTP secret and QR code for the user to scan.
     */
    public MfaSetupResponse generateMfaSetup(User user) {
        log.info("[MFA_SETUP] Generating TOTP secret | uuid={} | email={}", user.getUuid(), user.getEmail());

        SecretGenerator secretGenerator = new DefaultSecretGenerator(32);
        String secret = secretGenerator.generate();
        log.debug("[MFA_SETUP] TOTP secret generated (not logged for security)");

        QrData qrData = new QrData.Builder()
            .label(user.getEmail())
            .secret(secret)
            .issuer("Weshopify")
            .algorithm(HashingAlgorithm.SHA1)
            .digits(6)
            .period(30)
            .build();

        String qrCodeImage = "";
        try {
            QrGenerator generator = new ZxingPngQrGenerator();
            byte[] imageData = generator.generate(qrData);
            qrCodeImage = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageData);
            log.debug("[MFA_SETUP] QR code image generated | uuid={}", user.getUuid());
        } catch (QrGenerationException e) {
            log.error("[MFA_SETUP] QR code generation failed | uuid={} | error={}",
                user.getUuid(), e.getMessage());
        }

        log.info("[MFA_SETUP] Setup data ready | uuid={}", user.getUuid());
        return MfaSetupResponse.builder()
            .secret(secret)
            .qrCodeUri(qrData.getUri())
            .qrCodeImage(qrCodeImage)
            .build();
    }

    /**
     * Verifies the first TOTP code and enables MFA for the user.
     */
    @Transactional
    public void enableMfa(User user, String secret, String code) {
        log.info("[MFA_ENABLE] Enabling MFA | uuid={}", user.getUuid());

        if (!verifyCode(secret, code)) {
            log.warn("[MFA_ENABLE] TOTP code verification failed | uuid={}", user.getUuid());
            throw new InvalidMfaCodeException("Invalid MFA code. Please try again.");
        }

        String encryptedSecret = encrypt(secret);
        user.setMfaSecret(encryptedSecret);
        user.setMfaEnabled(true);
        userRepository.save(user);

        log.info("[MFA_ENABLE] MFA enabled and secret stored (encrypted) | uuid={}", user.getUuid());
    }

    /**
     * Verifies a TOTP code against the user's stored encrypted secret.
     */
    public boolean verifyUserMfaCode(User user, String code) {
        log.debug("[MFA_VERIFY] Verifying TOTP code | uuid={}", user.getUuid());

        if (!user.isMfaEnabled() || user.getMfaSecret() == null) {
            log.warn("[MFA_VERIFY] MFA not configured for user | uuid={}", user.getUuid());
            return false;
        }

        String decryptedSecret = decrypt(user.getMfaSecret());
        boolean valid = verifyCode(decryptedSecret, code);

        if (valid) {
            log.debug("[MFA_VERIFY] Code valid | uuid={}", user.getUuid());
        } else {
            log.warn("[MFA_VERIFY] Code invalid | uuid={}", user.getUuid());
        }

        return valid;
    }

    /**
     * Disables MFA and clears the stored secret.
     */
    @Transactional
    public void disableMfa(User user) {
        log.info("[MFA_DISABLE] Disabling MFA | uuid={}", user.getUuid());
        user.setMfaEnabled(false);
        user.setMfaSecret(null);
        userRepository.save(user);
        log.info("[MFA_DISABLE] MFA disabled and secret cleared | uuid={}", user.getUuid());
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private boolean verifyCode(String secret, String code) {
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator(HashingAlgorithm.SHA1, 6);
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        ((DefaultCodeVerifier) verifier).setTimePeriod(30);
        ((DefaultCodeVerifier) verifier).setAllowedTimePeriodDiscrepancy(1);
        return verifier.isValidCode(secret, code);
    }

    private String encrypt(String plainText) {
        log.debug("[MFA] Encrypting TOTP secret");
        TextEncryptor encryptor = Encryptors.text(encryptionPassword, ENCRYPTION_SALT);
        return encryptor.encrypt(plainText);
    }

    private String decrypt(String cipherText) {
        log.debug("[MFA] Decrypting TOTP secret");
        TextEncryptor encryptor = Encryptors.text(encryptionPassword, ENCRYPTION_SALT);
        return encryptor.decrypt(cipherText);
    }
}
