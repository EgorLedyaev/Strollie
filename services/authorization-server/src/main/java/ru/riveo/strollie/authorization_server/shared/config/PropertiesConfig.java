package ru.riveo.strollie.authorization_server.shared.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(AuthorizationProperties.class)
public class PropertiesConfig {
}
