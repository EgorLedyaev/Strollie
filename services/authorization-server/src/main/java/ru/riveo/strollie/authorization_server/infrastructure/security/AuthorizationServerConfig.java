package ru.riveo.strollie.authorization_server.infrastructure.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationConverter;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class AuthorizationServerConfig {

    private final AuthorizationProperties properties;

    private final List<AuthenticationConverter> customConverters;
    private final List<AuthenticationProvider> customProviders;

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http) throws Exception {
        OAuth2AuthorizationServerConfigurer authorizationServerConfigurer = new OAuth2AuthorizationServerConfigurer();

        http
                .securityMatcher(authorizationServerConfigurer.getEndpointsMatcher())
                .with(authorizationServerConfigurer, authorizationServer -> {
                    authorizationServer.tokenEndpoint(tokenEndpoint -> {
                        customConverters.forEach(tokenEndpoint::accessTokenRequestConverter);
                        customProviders.forEach(tokenEndpoint::authenticationProvider);
                    });
                    authorizationServer.oidc(Customizer.withDefaults());
                });

        return http.build();
    }

    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder()
                .issuer(properties.server().issuer())
                .build();
    }
}