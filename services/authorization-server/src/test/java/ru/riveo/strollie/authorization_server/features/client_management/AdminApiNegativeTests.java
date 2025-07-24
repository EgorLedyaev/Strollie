package ru.riveo.strollie.authorization_server.features.client_management;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ru.riveo.strollie.authorization_server.config.ApiIntegrationTest;
import ru.riveo.strollie.authorization_server.config.TestUserHelper;


/**
 * Тесты для проверки доступа к админским API (негативные сценарии).
 */
public class AdminApiNegativeTests extends ApiIntegrationTest {

    @Autowired
    private TestUserHelper testUserHelper;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.nickname}")
    private String adminNickname;


    private String normalUserAccessToken;
    private String adminAccessToken;

    @BeforeEach
    void setUp() throws Exception {
        // Настраиваем пользователя с обычными правами
        normalUserAccessToken = testUserHelper.createAndAuthenticateUser(
                "normal.user@example.com",
                "normaluser",
                "Normal",
                "User",
                "Normalville",
                "2000-01-01");

        // Настраиваем админа для теста назначения несуществующему пользователю
        testUserHelper.bootstrapFirstAdmin(adminEmail, adminNickname);
        adminAccessToken = testUserHelper.getAccessTokenForUser(adminEmail);
    }

    /**
     * Попытка доступа к админским эндпоинтам без токена.
     * <p>
     * Шаги:
     * 1. Отправить POST-запрос на /api/clients без заголовка Authorization.
     * 2. Убедиться, что ответ 401 Unauthorized.
     */
    @Test
    void accessAdminEndpoint_withoutToken_shouldReturnUnauthorized() throws Exception {
        String clientPayload = """
                {
                    "clientName": "Test Client",
                    "grantTypes": ["authorization_code", "refresh_token"],
                    "redirectUris": ["http://test.client/callback"],
                    "scopes": ["openid", "profile"]
                }
                """;

        mockMvc.perform(post("/api/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(clientPayload))
                .andExpect(status().isUnauthorized());
    }

    /**
     * Попытка доступа к админским эндпоинтам с токеном обычного
     * пользователя.
     * <p>
     * Шаги:
     * 1. Создать обычного пользователя и получить для него access_token.
     * 2. С этим токеном попытаться создать нового клиента через POST /api/clients.
     * 3. Убедиться, что ответ 403 Forbidden.
     */
    @Test
    void accessAdminEndpoint_withNormalUserToken_shouldReturnForbidden() throws Exception {
        String clientPayload = """
                {
                    "clientName": "Test Client From Normal User",
                    "grantTypes": ["authorization_code", "refresh_token"],
                    "redirectUris": ["http://test.client/callback"],
                    "scopes": ["openid", "profile"]
                }
                """;

        mockMvc.perform(post("/api/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + this.normalUserAccessToken)
                        .content(clientPayload))
                .andExpect(status().isForbidden());
    }

    /**
     * Попытка назначить роль несуществующему пользователю.
     * <p>
     * Шаги:
     * 1. Получить токен админа.
     * 2. Отправить запрос на /api/admin/roles/assign с email, которого нет в БД.
     * 3. Убедиться, что ответ 404 Not Found (с новым обработчиком исключений).
     */
    @Test
    void assignRole_toNonExistentUser_shouldReturnNotFound() throws Exception {
        String nonExistentEmail = "nonexistent.user@example.com";

        String rolePayload = """
                {
                    "email": "%s",
                    "role": "ROLE_ADMIN"
                }
                """.formatted(nonExistentEmail);

        mockMvc.perform(post("/api/admin/roles/assign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + this.adminAccessToken)
                        .content(rolePayload))
                .andExpect(status().isNotFound());
    }
}
