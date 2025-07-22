package ru.riveo.strollie.authorization_server.shared.security;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

/**
 * Тестовая конфигурация для генерации JWK источника с тестовыми ключами.
 * Избегает необходимости использовать реальный JKS файл в тестах.
 */
@Configuration
@Profile("test")
public class KeyStoreTestConfiguration {

    /**
     * Создаем генератор тестовых JWT ключей вместо чтения их из keystore
     */
    @Bean
    @Primary
    @ConditionalOnMissingBean(name = "jwkSource")
    public JWKSource<SecurityContext> jwkSource() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();

            RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
            RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

            JWK jwk = new RSAKey.Builder(publicKey)
                    .privateKey(privateKey)
                    .keyID(UUID.randomUUID().toString())
                    .build();

            JWKSet jwkSet = new JWKSet(jwk);
            return new ImmutableJWKSet<>(jwkSet);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Ошибка создания тестовых JWT ключей", e);
        }
    }
}
