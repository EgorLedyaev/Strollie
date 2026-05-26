package ru.riveo.strollie.authorization_server.infrastructure.security;

import org.springframework.security.oauth2.server.authorization.JdbcOAuth2AuthorizationService;

@FunctionalInterface
public interface OAuth2AuthorizationServiceCustomizer {
    void customize(JdbcOAuth2AuthorizationService.OAuth2AuthorizationRowMapper rowMapper);
}