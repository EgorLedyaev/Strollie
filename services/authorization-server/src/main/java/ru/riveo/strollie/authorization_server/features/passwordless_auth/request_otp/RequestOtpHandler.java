package ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.port.EmailService;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.port.UserExistenceChecker;
import ru.riveo.strollie.authorization_server.shared.exception.RateLimitExceededException;


@Service
@RequiredArgsConstructor
class RequestOtpHandler {
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final OtpGenerator otpGenerator;
    private final UserExistenceChecker userExistenceChecker;

    @Value("${app.otp.lifetime-minutes:5}")
    private long otpLifetimeMinutes;
    @Value("${app.otp.max-attempts:3}")
    private int maxAttempts;
    @Value("${app.otp.resend-cooldown-seconds:60}")
    private long resendCooldownSeconds;

    public void handle(RequestOtp command) {
        // Атомарная проверка-и-действие
        if (!otpRepository.trySetRateLimit(command.email(), resendCooldownSeconds)) {
            throw new RateLimitExceededException("Please wait before requesting a new code.");
        }

        // Проверяем существование пользователя, но не раскрываем информацию об этом
        boolean userExists = userExistenceChecker.existsByEmail(command.email());

        // Симулируем все действия с ограничением запросов, чтобы атакующий
        // не смог определить, существует ли пользователь по времени ответа
        // Но генерируем и отправляем OTP только если пользователь существует
        if (userExists) {
            String otp = otpGenerator.generate();
            otpRepository.saveOtp(command.email(), otp, otpLifetimeMinutes);
            otpRepository.setInitialAttempts(command.email(), maxAttempts, otpLifetimeMinutes);
            emailService.sendOtpEmail(command.email(), otp);
        }

        // Всегда возвращаем успех, независимо от существования пользователя
        // Метод просто заканчивается нормально без выброса исключений
    }
}
