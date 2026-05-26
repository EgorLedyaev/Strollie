package ru.riveo.strollie.authorization_server.shared.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import ru.riveo.strollie.authorization_server.infrastructure.security.AuthorizationProperties;
import ru.riveo.strollie.authorization_server.infrastructure.system.AdminProperties;

@Configuration
@EnableConfigurationProperties({AuthorizationProperties.class, AdminProperties.class})
public class PropertiesConfig {
}
