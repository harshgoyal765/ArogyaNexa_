package in.arogyanexa.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import in.arogyanexa.service.CustomUserDetailsService;
import in.arogyanexa.service.TokenBlacklistService;

import java.io.IOException;

/**
 * JWT Authentication Filter - validates JWT tokens on every request.
 * Runs once per request before Spring Security's authentication filters.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
                                   CustomUserDetailsService userDetailsService,
                                   TokenBlacklistService tokenBlacklistService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.trace("[JWT_FILTER] No Bearer token found — skipping authentication");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        log.debug("[JWT_FILTER] Token extracted from Authorization header");

        // Check if token is blacklisted (logout)
        if (tokenBlacklistService.isBlacklisted(token)) {
            log.warn("[JWT_FILTER] Blacklisted token used — rejecting request");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Token has been revoked\"}");
            return;
        }

        // Validate token
        if (!jwtTokenProvider.validateToken(token)) {
            log.warn("[JWT_FILTER] Invalid token — rejecting request");
            filterChain.doFilter(request, response);
            return;
        }

        // Extract user UUID and load user details
        String userUuid = jwtTokenProvider.extractUuid(token);
        log.debug("[JWT_FILTER] Token valid | uuid={}", userUuid);

        if (userUuid != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(
                    jwtTokenProvider.parseClaims(token).get("email", String.class)
                );

                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                log.debug("[JWT_FILTER] Authentication set | uuid={} | authorities={}",
                    userUuid, userDetails.getAuthorities());

            } catch (Exception e) {
                log.error("[JWT_FILTER] Failed to set authentication | uuid={} | error={}",
                    userUuid, e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
