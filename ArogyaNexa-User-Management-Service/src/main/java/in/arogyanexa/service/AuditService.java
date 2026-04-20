package in.arogyanexa.service;


 
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import in.arogyanexa.entity.AuditLog;
import in.arogyanexa.repository.AuditLogRepository;

/**
 * Async audit logging service.
 * All security events are logged without blocking the main request thread.
 */
@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Async
    public void log(Long userId, String action, String resource,
                    String details, String status, HttpServletRequest request) {
        AuditLog log = AuditLog.builder()
            .userId(userId)
            .action(action)
            .resource(resource)
            .details(details)
            .status(status)
            .ipAddress(extractIp(request))
            .userAgent(request != null ? request.getHeader("User-Agent") : null)
            .build();

        auditLogRepository.save(log);
    }

    @Async
    public void log(Long userId, String action, String status) {
        AuditLog log = AuditLog.builder()
            .userId(userId)
            .action(action)
            .status(status)
            .build();
        auditLogRepository.save(log);
    }

    private String extractIp(HttpServletRequest request) {
        if (request == null) return null;
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
