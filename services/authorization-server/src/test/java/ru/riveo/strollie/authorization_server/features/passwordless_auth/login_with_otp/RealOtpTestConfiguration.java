package ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.userdetails.UserDetailsService;

import ru.riveo.strollie.authorization_server.features.passwordless_auth.UserRegistrationService;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;
import ru.riveo.strollie.authorization_server.shared.security.OtpAuthenticationProvider;

/**
 * Тестовая конфигурация для реальной OTP аутентификации (без моков)
 */
@TestConfiguration
@Profile("real-otp")
public class RealOtpTestConfiguration {

    /**
     * Создает бин реального провайдера аутентификации OTP
     */
    @Bean
    @Primary
    public OtpAuthenticationProvider realOtpAuthenticationProvider(
            OtpRepository otpRepository,
            UserDetailsService userDetailsService,
            UserRegistrationService userRegistrationService) {
        return new OtpAuthenticationProvider(otpRepository, userDetailsService, userRegistrationService);
    }
}
