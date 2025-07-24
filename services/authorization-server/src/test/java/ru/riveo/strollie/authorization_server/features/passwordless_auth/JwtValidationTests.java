package ru.riveo.strollie.authorization_server.features.passwordless_auth;

import java.util.Date;

import org.json.JSONObject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.nimbusds.jwt.JWTParser;
import com.nimbusds.jwt.SignedJWT;

import ru.riveo.strollie.authorization_server.config.ApiIntegrationTest;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;

/**
 * Тесты для валидации JWT токенов
 */
public class JwtValidationTests extends ApiIntegrationTest {

    @Autowired
    private OtpRepository otpRepository;

    /**
     * Тест проверки содержимого JWT токена.
     * <p>
     * Шаги:
     * 1. Создать пользователя.
     * 2. Пройти процесс аутентификации и получить токены.
     * 3. Распарсить access_token как JWT.
     * 4. Проверить наличие всех необходимых полей в JWT (subject, issued_at,
     * expiration, и т.д.).
     * 5. Проверить, что значения полей соответствуют ожидаемым (например, subject =
     * email пользователя).
     */
    @Test
    void accessToken_shouldContainValidJwtClaims() throws Exception {
        // 1. Создаем пользователя
        String email = "jwt.validation.user@example.com";
        String userPayload = """
                {
                    "email": "jwt.validation.user@example.com",
                    "firstName": "JWT",
                    "lastName": "Validation",
                    "city": "JWTville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "jwtvalidation"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Запрашиваем OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"" + email + "\"}"))
                .andExpect(status().isOk());

        // Получаем OTP из репозитория
        String otp = otpRepository.findOtp(email)
                .orElseThrow(() -> new AssertionError("OTP не найден"));

        // Обмениваем OTP на токены
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        params.add("email", email);
        params.add("otp", otp);

        String response = mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(params)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ=")) // mobile-app:secret в Base64
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // 3. Извлекаем access_token из ответа
        String accessToken = new JSONObject(response).getString("access_token");

        // Парсим JWT
        SignedJWT jwt = (SignedJWT) JWTParser.parse(accessToken);
        JSONObject claims = new JSONObject(jwt.getPayload().toString());

        // 4. Проверяем наличие необходимых полей
        assertTrue(claims.has("sub"), "JWT должен содержать поле 'sub' (subject)");
        assertTrue(claims.has("iat"), "JWT должен содержать поле 'iat' (issued at)");
        assertTrue(claims.has("exp"), "JWT должен содержать поле 'exp' (expiration)");
        assertTrue(claims.has("jti"), "JWT должен содержать поле 'jti' (JWT ID)");

        // 5. Проверяем значения полей
        assertEquals(email, claims.getString("sub"), "Subject должен соответствовать email пользователя");

        // Проверяем, что токен не просрочен
        Date now = new Date();
        Date expiration = new Date(claims.getLong("exp") * 1000);
        assertTrue(expiration.after(now), "Срок действия токена должен быть в будущем");

        // Проверяем, что токен был выдан недавно (в течение последней минуты)
        Date issuedAt = new Date(claims.getLong("iat") * 1000);
        long differenceInMillis = now.getTime() - issuedAt.getTime();
        assertTrue(differenceInMillis < 60000, "Токен должен быть выдан не более минуты назад");
    }
}
