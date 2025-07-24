package ru.riveo.strollie.authorization_server.infrastructure.notification;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.port.EmailService;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmtpEmailService implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    @Async
    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@strollie.com");
            message.setTo(to);
            message.setSubject("Your Authentication Code");
            message.setText("Your one-time password is: " + otp + "\nIt is valid for 5 minutes.");
            mailSender.send(message);
            log.info("OTP email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", to, e);
        }
    }
}
