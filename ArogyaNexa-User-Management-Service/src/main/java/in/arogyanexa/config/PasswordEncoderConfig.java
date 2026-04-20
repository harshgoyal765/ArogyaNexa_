package in.arogyanexa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Separate configuration for PasswordEncoder bean.
 * This prevents circular dependency issues with SecurityConfig.
 */
@Configuration
public class PasswordEncoderConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Strength 12 — good balance of security and performance
        return new BCryptPasswordEncoder(12);
    }
}
