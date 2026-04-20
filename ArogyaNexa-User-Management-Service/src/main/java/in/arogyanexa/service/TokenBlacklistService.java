package in.arogyanexa.service;

 

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Manages JWT token blacklist using Redis.
 * When a user logs out, their access token is blacklisted until it expires.
 */
@Service
public class TokenBlacklistService {

    private static final Logger log = LoggerFactory.getLogger(TokenBlacklistService.class);

    private static final String BLACKLIST_PREFIX = "blacklist:token:";

    private final StringRedisTemplate redisTemplate;

    public TokenBlacklistService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Adds a token to the blacklist with a TTL matching its remaining validity.
     */
    public void blacklist(String token, long ttlSeconds) {
        String key = BLACKLIST_PREFIX + token;
        redisTemplate.opsForValue().set(key, "revoked", Duration.ofSeconds(ttlSeconds));
        log.debug("[BLACKLIST] Token blacklisted | ttlSeconds={}", ttlSeconds);
    }

    /**
     * Checks if a token has been blacklisted.
     */
    public boolean isBlacklisted(String token) {
        boolean blacklisted = Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + token));
        if (blacklisted) {
            log.warn("[BLACKLIST] Blacklisted token used — request rejected");
        }
        return blacklisted;
    }
}

