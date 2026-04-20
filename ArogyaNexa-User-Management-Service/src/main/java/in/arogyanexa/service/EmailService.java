package in.arogyanexa.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String firstName, String resetToken) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        String subject = "Weshopify - Password Reset Request";
        String body = (
                """
                Hi %s,
                
                You requested a password reset for your Weshopify account.
                
                Click the link below to reset your password (valid for 15 minutes):
                %s
                
                If you did not request this, please ignore this email.
                
                Regards,
                Weshopify Security Team""").formatted(
                firstName, resetLink
        );
        sendEmail(toEmail, subject, body);
    }

    @Async
    public void sendEmailVerification(String toEmail, String firstName, String verificationToken) {
        String verifyLink = frontendUrl + "/verify-email?token=" + verificationToken;
        String subject = "Weshopify - Verify Your Email";
        String body = (
                """
                Hi %s,
                
                Welcome to Weshopify! Please verify your email address:
                %s
                
                This link expires in 24 hours.
                
                Regards,
                Weshopify Team""").formatted(
                firstName, verifyLink
        );
        sendEmail(toEmail, subject, body);
    }

    @Async
    public void sendAccountLockedEmail(String toEmail, String firstName, int lockMinutes) {
        String subject = "Weshopify - Account Temporarily Locked";
        String body = (
                """
                Hi %s,
                
                Your account has been temporarily locked due to multiple failed login attempts.
                It will be automatically unlocked after %d minutes.
                
                If this was not you, please contact support immediately.
                
                Regards,
                Weshopify Security Team""").formatted(
                firstName, lockMinutes
        );
        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
