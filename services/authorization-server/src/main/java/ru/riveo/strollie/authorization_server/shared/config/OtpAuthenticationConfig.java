package ru.riveo.strollie.authorization_server.shared.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.OAuth2OtpAuthenticationProvider;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.OtpAuthenticationConverter;
import ru.riveo.strollie.authorization_server.shared.security.OtpAuthenticationProvider;

@Configuration
@RequiredArgsConstructor
public class OtpAuthenticationConfig {

    private final OAuth2TokenGenerator<?> tokenGenerator;
    private final OAuth2AuthorizationService authorizationService;
    private final OtpAuthenticationProvider otpAuthenticationProvider;

    @Bean
    public OtpAuthenticationConverter otpAuthenticationConverter() {
        return new OtpAuthenticationConverter();
    }
}

