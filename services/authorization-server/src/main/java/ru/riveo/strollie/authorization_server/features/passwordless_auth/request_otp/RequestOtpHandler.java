package ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.infrastructure.notification.EmailService;
import ru.riveo.strollie.authorization_server.shared.security.OtpGenerator;

@Service
@RequiredArgsConstructor
class RequestOtpHandler {
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final OtpGenerator otpGenerator;

    @Value("${app.otp.lifetime-minutes:5}")
    private long otpLifetimeMinutes;
    @Value("${app.otp.max-attempts:3}")
    private int maxAttempts;
    @Value("${app.otp.resend-cooldown-seconds:60}")
    private long resendCooldownSeconds;

    public void handle(RequestOtp command) {
        if (otpRepository.isRateLimited(command.email())) {
            throw new IllegalStateException("Please wait before requesting a new code.");
        }

        String otp = otpGenerator.generate();
        otpRepository.saveOtp(command.email(), otp, otpLifetimeMinutes);
        otpRepository.setInitialAttempts(command.email(), maxAttempts, otpLifetimeMinutes);
        emailService.sendOtpEmail(command.email(), otp);
        otpRepository.setRateLimit(command.email(), resendCooldownSeconds);
    }
}
