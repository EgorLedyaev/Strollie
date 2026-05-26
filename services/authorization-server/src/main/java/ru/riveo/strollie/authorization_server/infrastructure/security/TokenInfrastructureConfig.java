package ru.riveo.strollie.authorization_server.infrastructure.security;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.token.*;

import java.io.IOException;
import java.io.InputStream;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class TokenInfrastructureConfig {

    private final AuthorizationProperties properties;
    private final ResourceLoader resourceLoader;

    @Bean
    @ConditionalOnMissingBean(name = "jwkSource")
    public JWKSource<SecurityContext> jwkSource() {
        KeyPair keyPair = loadKeyPair();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
        RSAKey rsaKey = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(UUID.randomUUID().toString())
                .build();
        JWKSet jwkSet = new JWKSet(rsaKey);
        return new ImmutableJWKSet<>(jwkSet);
    }

    @Bean
    @ConditionalOnMissingBean(name = "tokenGenerator")
    public OAuth2TokenGenerator<?> tokenGenerator(JWKSource<SecurityContext> jwkSource,
                                                  OAuth2TokenCustomizer<JwtEncodingContext> jwtTokenCustomizer) {
        JwtEncoder jwtEncoder = new NimbusJwtEncoder(jwkSource);
        JwtGenerator jwtGenerator = new JwtGenerator(jwtEncoder);
        jwtGenerator.setJwtCustomizer(jwtTokenCustomizer);
        OAuth2AccessTokenGenerator accessTokenGenerator = new OAuth2AccessTokenGenerator();
        OAuth2RefreshTokenGenerator refreshTokenGenerator = new OAuth2RefreshTokenGenerator();
        return new DelegatingOAuth2TokenGenerator(jwtGenerator, accessTokenGenerator, refreshTokenGenerator);
    }

    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> jwtTokenCustomizer() {
        return (context) -> {
            if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
                Authentication principal = context.getPrincipal();
                Set<String> authorities = principal.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toSet());
                context.getClaims().claim("authorities", authorities);
            }
        };
    }

    private KeyPair loadKeyPair() {
        try {
            Resource keystoreResource = resourceLoader.getResource(properties.security().keystore().path());
            try (InputStream is = keystoreResource.getInputStream()) {
                KeyStore keyStore = KeyStore.getInstance("JKS");
                keyStore.load(is, properties.security().keystore().password().toCharArray());

                String keyAlias = properties.security().keystore().keyAlias();
                String keyPassphrase = properties.security().keystore().privateKeyPassphrase();

                Key key = keyStore.getKey(keyAlias, keyPassphrase.toCharArray());
                if (key instanceof PrivateKey privateKey) {
                    Certificate cert = keyStore.getCertificate(keyAlias);
                    PublicKey publicKey = cert.getPublicKey();
                    return new KeyPair(publicKey, privateKey);
                }
                throw new IllegalStateException("Unable to load key pair");
            }
        } catch (KeyStoreException | IOException | NoSuchAlgorithmException | CertificateException
                 | UnrecoverableKeyException e) {
            throw new RuntimeException("Failed to load keys from keystore", e);
        }
    }
}