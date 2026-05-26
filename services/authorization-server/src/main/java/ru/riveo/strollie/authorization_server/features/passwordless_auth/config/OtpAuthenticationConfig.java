package ru.riveo.strollie.authorization_server.features.passwordless_auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.OAuth2OtpAuthenticationProvider;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.OtpAuthenticationConverter;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.OtpAuthenticationProvider;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.port.UserAccountFinder;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;

@Configuration
public class OtpAuthenticationConfig {

    @Bean
    public OtpAuthenticationConverter otpAuthenticationConverter() {
        return new OtpAuthenticationConverter();
    }

    @Bean
    public OAuth2OtpAuthenticationProvider oAuth2OtpAuthenticationProvider(
            OAuth2TokenGenerator<?> tokenGenerator,
            OAuth2AuthorizationService authorizationService,
            OtpRepository otpRepository,
            UserAccountFinder userAccountFinder) {
        OtpAuthenticationProvider internalOtpProvider = new OtpAuthenticationProvider(otpRepository, userAccountFinder);
        return new OAuth2OtpAuthenticationProvider(tokenGenerator, authorizationService, internalOtpProvider);
    }
}