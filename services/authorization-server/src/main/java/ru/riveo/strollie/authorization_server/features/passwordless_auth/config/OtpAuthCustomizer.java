// В features/passwordless_auth/config/OtpAuthCustomizer.java
package ru.riveo.strollie.authorization_server.features.passwordless_auth.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.jackson2.SecurityJackson2Modules;
import org.springframework.security.oauth2.server.authorization.JdbcOAuth2AuthorizationService;
import org.springframework.stereotype.Component;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.OtpAuthenticationToken;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.OtpAuthenticationTokenMixin;
import ru.riveo.strollie.authorization_server.infrastructure.security.OAuth2AuthorizationServiceCustomizer;

import java.util.List;

@Component
public class OtpAuthCustomizer implements OAuth2AuthorizationServiceCustomizer {

    @Override
    public void customize(JdbcOAuth2AuthorizationService.OAuth2AuthorizationRowMapper rowMapper) {
        ObjectMapper objectMapper = new ObjectMapper();
        ClassLoader classLoader = JdbcOAuth2AuthorizationService.class.getClassLoader();
        List<Module> securityModules = SecurityJackson2Modules.getModules(classLoader);
        objectMapper.registerModules(securityModules);

        // Добавляем Mixin ТОЛЬКО для нашей фичи
        objectMapper.addMixIn(OtpAuthenticationToken.class, OtpAuthenticationTokenMixin.class);

        rowMapper.setObjectMapper(objectMapper);
    }
}