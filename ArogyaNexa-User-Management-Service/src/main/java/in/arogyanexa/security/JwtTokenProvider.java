package in.arogyanexa.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import in.arogyanexa.entity.User;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Handles JWT access token generation, validation, and claims extraction.
 * Also generates secure opaque refresh tokens.
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiry}")
    private long accessTokenExpiry;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    /**
     * Generates a signed JWT access token with user claims.
     */
    public String generateAccessToken(User user) {
        log.debug("[JWT] Generating access token | uuid={} | roles={}",
            user.getUuid(), user.getRoleNames());

        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenExpiry);

        Set<String> roles = user.getRoleNames();
        Set<String> permissions = user.getAuthorities().stream()
            .map(a -> a.getAuthority())
            .filter(a -> !a.startsWith("ROLE_"))
            .collect(Collectors.toSet());

        String token = Jwts.builder()
            .subject(user.getUuid().toString())
            .claim("email", user.getEmail())
            .claim("roles", roles)
            .claim("permissions", permissions)
            .claim("fullName", user.getFullName())
            .issuedAt(now)
            .expiration(expiry)
            .issuer("weshopify-iam")
            .signWith(getSigningKey())
            .compact();

        log.debug("[JWT] Access token generated | uuid={} | expiresAt={}", user.getUuid(), expiry);
        return token;
    }

    /**
     * Generates a short-lived MFA session token (5 min).
     */
    public String generateMfaSessionToken(String userUuid) {
        log.debug("[JWT] Generating MFA session token | uuid={}", userUuid);

        Date now = new Date();
        Date expiry = new Date(now.getTime() + 300_000);

        String token = Jwts.builder()
            .subject(userUuid)
            .claim("type", "MFA_SESSION")
            .issuedAt(now)
            .expiration(expiry)
            .issuer("weshopify-iam")
            .signWith(getSigningKey())
            .compact();

        log.debug("[JWT] MFA session token generated | uuid={}", userUuid);
        return token;
    }

    /**
     * Generates a cryptographically secure opaque refresh token.
     * Store only its SHA-256 hash in the database.
     */
    public String generateRefreshToken() {
        byte[] bytes = new byte[64];
        new SecureRandom().nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        log.debug("[JWT] Opaque refresh token generated");
        return token;
    }

    /**
     * SHA-256 hash of a token for safe DB storage.
     */
    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("[JWT] SHA-256 not available — critical error");
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    /**
     * Validates a JWT token — returns true if valid, false otherwise.
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            log.debug("[JWT] Token valid");
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("[JWT] Token expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("[JWT] Unsupported token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("[JWT] Malformed token: {}", e.getMessage());
        } catch (SecurityException e) {
            log.warn("[JWT] Invalid signature: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("[JWT] Empty claims: {}", e.getMessage());
        }
        return false;
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public String extractUuid(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractTokenType(String token) {
        return parseClaims(token).get("type", String.class);
    }

    public long getAccessTokenExpirySeconds() {
        return accessTokenExpiry / 1000;
    }

    public LocalDateTime getRefreshTokenExpiry() {
        return LocalDateTime.now().plusSeconds(refreshTokenExpiry / 1000);
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
