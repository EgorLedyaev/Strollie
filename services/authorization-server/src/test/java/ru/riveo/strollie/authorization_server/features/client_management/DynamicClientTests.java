package ru.riveo.strollie.authorization_server.features.client_management;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import ru.riveo.strollie.authorization_server.config.ApiIntegrationTest;
import ru.riveo.strollie.authorization_server.config.TestUserHelper;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;

/**
 * Тесты для динамически создаваемых OAuth-клиентов
 */
public class DynamicClientTests extends ApiIntegrationTest {

    @Autowired
    private TestUserHelper testUserHelper;

    @Autowired
    private OtpRepository otpRepository;

    @Value("${app.admin.email}")
    private String initialAdminEmail;

    @Value("${app.admin.nickname}")
    private String initialAdminNickname;

    /**
     * Тест на использование динамически созданного OAuth клиента.
     * <p>
     * Шаги:
     * 1. Создать администратора и получить его access_token.
     * 2. Использовать этот токен для создания нового OAuth-клиента.
     * 3. Создать обычного пользователя.
     * 4. Получить OTP для этого пользователя.
     * 5. Обменять OTP на токены, используя новый клиент.
     * 6. Проверить успешность обмена.
     */
    @Test
    void dynamicallyCreatedClient_shouldBeAbleToExchangeOtp() throws Exception {
        // 1. Получаем токен администратора
        testUserHelper.bootstrapFirstAdmin(initialAdminEmail, initialAdminNickname);
        String adminAccessToken = testUserHelper.getAccessTokenForUser(initialAdminEmail);

        // 2. Создаем новый OAuth клиент
        String clientPayload = """
                {
                    "clientName": "Dynamic Test Client",
                    "grantTypes": ["urn:ietf:params:oauth:grant-type:otp", "refresh_token"],
                    "redirectUris": ["http://dynamic.client/callback"],
                    "scopes": ["openid", "profile"]
                }
                """;

        String clientResponse = mockMvc.perform(post("/api/clients")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminAccessToken)
                .content(clientPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.clientId").exists())
                .andExpect(jsonPath("$.clientSecret").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Извлекаем clientId и clientSecret из ответа
        String clientId = new org.json.JSONObject(clientResponse).getString("clientId");
        String clientSecret = new org.json.JSONObject(clientResponse).getString("clientSecret");

        // 3. Создаем обычного пользователя
        String userPayload = """
                {
                    "email": "dynamic.client.user@example.com",
                    "firstName": "Dynamic",
                    "lastName": "Client",
                    "city": "Dynamicville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "dynamicclient"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 4. Запрашиваем OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"dynamic.client.user@example.com\"}"))
                .andExpect(status().isOk());

        // Получаем OTP из репозитория
        String otp = otpRepository.findOtp("dynamic.client.user@example.com")
                .orElseThrow(() -> new AssertionError("OTP не найден"));

        // 5. Обмениваем OTP на токены с использованием нового клиента
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        params.add("email", "dynamic.client.user@example.com");
        params.add("otp", otp);

        // Создаем заголовок авторизации с новыми credentials
        String authHeader = "Basic "
                + java.util.Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());

        // 6. Проверяем успешность обмена
        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(params)
                .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").exists())
                .andExpect(jsonPath("$.refresh_token").exists());
    }
}
