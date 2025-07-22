package ru.riveo.strollie.authorization_server.shared.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

/**
 * Конфигурационные свойства для сервера авторизации
 */
@ConfigurationProperties(prefix = "authorization")
public record AuthorizationProperties(
        @NestedConfigurationProperty ServerProperties server,
        @NestedConfigurationProperty SecurityProperties security) {

    /**
     * Свойства сервера авторизации
     */
    public record ServerProperties(String issuer) {
    }

    /**
     * Свойства безопасности
     */
    public record SecurityProperties(@NestedConfigurationProperty KeystoreProperties keystore) {
    }

    /**
     * Свойства хранилища ключей
     */
    public record KeystoreProperties(String path, String password, String keyAlias, String privateKeyPassphrase) {
    }
}
