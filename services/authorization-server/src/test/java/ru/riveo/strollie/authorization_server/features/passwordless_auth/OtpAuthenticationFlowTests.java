package ru.riveo.strollie.authorization_server.features.passwordless_auth;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import ru.riveo.strollie.authorization_server.config.ApiIntegrationTest;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;

public class OtpAuthenticationFlowTests extends ApiIntegrationTest {

    @Autowired
    private OtpRepository otpRepository;

    /**
     * Успешный запрос OTP для существующего пользователя.
     * <p>
     * Шаги:
     * 1. Создать пользователя через POST /api/users/register.
     * 2. Отправить запрос на /api/auth/request-otp с его email.
     * 3. Убедиться, что ответ — 200 OK.
     * 4. Проверить, что в Redis (через OtpRepository) появился OTP для этого email.
     */
    @Test
    void requestOtp_whenUserExists_shouldReturnOkAndStoreOtp() throws Exception {
        // 1. Создаем пользователя
        String userPayload = """
                {
                    "email": "test.user@example.com",
                    "firstName": "Test",
                    "lastName": "User",
                    "city": "Testville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "testuser123"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Отправляем запрос на получение OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"test.user@example.com\"}"))
                .andExpect(status().isOk());

        // 3. Проверяем, что OTP сохранился в репозитории
        assertTrue(otpRepository.findOtp("test.user@example.com").isPresent(),
                "OTP должен быть сохранен для существующего пользователя");

        // 4. Проверяем, что отправлено письмо с OTP
        verify(javaMailSender, times(1))
                .send(org.mockito.ArgumentMatchers.any(org.springframework.mail.SimpleMailMessage.class));
    }

    /**
     * Запрос OTP для несуществующего пользователя.
     * <p>
     * Безопасное поведение:
     * - Для несуществующего пользователя возвращается 200 ОК (как и для
     * существующего)
     * - OTP НЕ создается и НЕ сохраняется в Redis для несуществующих пользователей
     * - Email НЕ отправляется для несуществующих пользователей
     * - Ограничения по количеству запросов применяются независимо от существования
     * пользователя
     * <p>
     * Это защищает от атак на перечисление пользователей, так как злоумышленник
     * не может отличить существующий email от несуществующего.
     */
    @Test
    void requestOtp_whenUserDoesNotExist_shouldBehaveConsistently() throws Exception {
        String nonExistentEmail = "nonexistent.user@example.com";

        // 1. Отправляем запрос на получение OTP для несуществующего пользователя
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"" + nonExistentEmail + "\"}"))
                .andExpect(status().isOk());

        // 2. Проверяем, что OTP НЕ был сохранен
        assertTrue(otpRepository.findOtp(nonExistentEmail).isEmpty(),
                "OTP не должен создаваться для несуществующего пользователя");

        // 3. Проверяем, что письмо НЕ было отправлено
        verify(javaMailSender, times(0))
                .send(org.mockito.ArgumentMatchers.any(org.springframework.mail.SimpleMailMessage.class));
    }

    /**
     * Проверка ограничения частоты запросов (Rate Limiting).
     * <p>
     * Шаги:
     * 1. Создать пользователя.
     * 2. Отправить первый запрос на /api/auth/request-otp. Он должен пройти успешно
     * (200 OK).
     * 3. Немедленно отправить второй запрос на тот же email.
     * 4. Убедиться, что второй запрос возвращает 429 Too Many Requests.
     */
    @Test
    void requestOtp_whenRateLimited_shouldReturnTooManyRequests() throws Exception {
        // 1. Создаем пользователя
        String userPayload = """
                {
                    "email": "rate.limited.user@example.com",
                    "firstName": "Rate",
                    "lastName": "Limited",
                    "city": "Limitville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "ratelimited"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Отправляем первый запрос на OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"rate.limited.user@example.com\"}"))
                .andExpect(status().isOk());

        // 3. Немедленно отправляем второй запрос
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"rate.limited.user@example.com\"}"))
                .andExpect(status().is(429)); // 429 Too Many Requests
    }

    /**
     * Успешный обмен валидного OTP на токены.
     * <p>
     * Шаги:
     * 1. Создать пользователя.
     * 2. Запросить для него OTP.
     * 3. Получить OTP из OtpRepository.
     * 4. Отправить запрос на /oauth2/token с
     * grant_type='urn:ietf:params:oauth:grant-type:otp',
     * email, полученным OTP и корректными кредами клиента (mobile-app:secret).
     * 5. Проверить, что ответ 200 OK и содержит access_token и refresh_token.
     */
    @Test
    void exchangeOtp_withValidOtp_shouldReturnTokens() throws Exception {
        // 1. Создаем пользователя
        String userPayload = """
                {
                    "email": "token.user@example.com",
                    "firstName": "Token",
                    "lastName": "User",
                    "city": "Tokenville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "tokenuser"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Запрашиваем OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"token.user@example.com\"}"))
                .andExpect(status().isOk());

        // 3. Получаем OTP из репозитория
        String otp = otpRepository.findOtp("token.user@example.com")
                .orElseThrow(() -> new AssertionError("OTP не найден"));

        // 4. Обмениваем OTP на токены
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        params.add("email", "token.user@example.com");
        params.add("otp", otp);

        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(params)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ=")) // mobile-app:secret в Base64
                .andExpect(status().isOk());
    }

    /**
     * Попытка обмена с неверным OTP.
     * <p>
     * Шаги:
     * 1. Выполнить шаги 1-2 из предыдущего теста.
     * 2. Отправить запрос на /oauth2/token с заведомо неверным OTP (например,
     * 0000).
     * 3. Убедиться, что ответ 400 Bad Request и тело ответа содержит ошибку
     * {"error":"invalid_grant"}.
     */
    @Test
    void exchangeOtp_withInvalidOtp_shouldReturnBadRequest() throws Exception {
        // 1. Создаем пользователя
        String userPayload = """
                {
                    "email": "invalid.otp.user@example.com",
                    "firstName": "Invalid",
                    "lastName": "OTP",
                    "city": "Invalidville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "invalidotp"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Запрашиваем OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"invalid.otp.user@example.com\"}"))
                .andExpect(status().isOk());

        // 3. Пытаемся обменять неверный OTP на токены
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        params.add("email", "invalid.otp.user@example.com");
        params.add("otp", "0000"); // Заведомо неверный OTP

        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(params)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ=")) // mobile-app:secret в Base64
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));
    }

    /**
     * Попытка повторного использования OTP.
     * <p>
     * Шаги:
     * 1. Провести успешный обмен (как в Тесте 4).
     * 2. Попытаться немедленно отправить точно такой же запрос на обмен еще раз.
     * 3. Убедиться, что второй запрос провалился с ошибкой invalid_grant,
     * так как OTP уже был удален из Redis.
     */
    @Test
    void exchangeOtp_whenReusingOtp_shouldReturnBadRequest() throws Exception {
        // 1. Создаем пользователя
        String userPayload = """
                {
                    "email": "reuse.otp.user@example.com",
                    "firstName": "Reuse",
                    "lastName": "OTP",
                    "city": "Reuseville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "reuseotp"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Запрашиваем OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"reuse.otp.user@example.com\"}"))
                .andExpect(status().isOk());

        // 3. Получаем OTP из репозитория
        String otp = otpRepository.findOtp("reuse.otp.user@example.com")
                .orElseThrow(() -> new AssertionError("OTP не найден"));

        // 4. Успешно обмениваем OTP на токены (первый раз)
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        params.add("email", "reuse.otp.user@example.com");
        params.add("otp", otp);

        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(params)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ=")) // mobile-app:secret в Base64
                .andExpect(status().isOk());

        // 5. Пытаемся использовать тот же OTP повторно
        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(params)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ="))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));
    }

    /**
     * Тест на использование Refresh Token.
     * <p>
     * Шаги:
     * 1. Пройти полный цикл аутентификации и получить access_token и refresh_token.
     * 2. Отправить запрос на эндпоинт /oauth2/token с grant_type=refresh_token и
     * полученным refresh_token.
     * 3. Проверить, что получен новый access_token и refresh_token.
     */
    @Test
    void useRefreshToken_shouldReturnNewTokens() throws Exception {
        // 1. Создаем пользователя
        String userPayload = """
                {
                    "email": "refresh.token.user@example.com",
                    "firstName": "Refresh",
                    "lastName": "Token",
                    "city": "Refreshville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "refreshtoken"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Запрашиваем OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"refresh.token.user@example.com\"}"))
                .andExpect(status().isOk());

        // 3. Получаем OTP из репозитория
        String otp = otpRepository.findOtp("refresh.token.user@example.com")
                .orElseThrow(() -> new AssertionError("OTP не найден"));

        // 4. Обмениваем OTP на токены
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        params.add("email", "refresh.token.user@example.com");
        params.add("otp", otp);

        // Выполняем запрос и сохраняем ответ
        String tokenResponse = mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(params)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ=")) // mobile-app:secret в Base64
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.refresh_token").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // 5. Извлекаем ПЕРВЫЙ refresh_token
        JSONObject firstResponseJson = new JSONObject(tokenResponse);
        String initialRefreshToken = firstResponseJson.getString("refresh_token");
        String initialAccessToken = firstResponseJson.getString("access_token");

        // 6. Используем refresh_token для получения новых токенов
        MultiValueMap<String, String> refreshParams = new LinkedMultiValueMap<>();
        refreshParams.add("grant_type", "refresh_token");
        refreshParams.add("refresh_token", initialRefreshToken);

        String secondTokenResponse = mockMvc.perform(post("/oauth2/token")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .params(refreshParams)
                        .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ="))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").exists())
                .andExpect(jsonPath("$.refresh_token").exists())
                .andReturn().getResponse().getContentAsString();

        // 7. Проверяем, что новые токены ОТЛИЧАЮТСЯ от старых
        JSONObject secondResponseJson = new JSONObject(secondTokenResponse);
        String newAccessToken = secondResponseJson.getString("access_token");
        String newRefreshToken = secondResponseJson.getString("refresh_token");

        assertNotEquals(initialAccessToken, newAccessToken, "Новый access_token должен отличаться от старого.");
        assertNotEquals(initialRefreshToken, newRefreshToken, "Новый refresh_token должен отличаться от старого (ротация).");

        // 8. (Критически важный шаг) Убедимся, что старый refresh_token больше не действителен
        MultiValueMap<String, String> reuseParams = new LinkedMultiValueMap<>();
        reuseParams.add("grant_type", "refresh_token");
        reuseParams.add("refresh_token", initialRefreshToken); // Попытка повторного использования

        mockMvc.perform(post("/oauth2/token")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .params(reuseParams)
                        .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ="))
                .andExpect(status().isBadRequest()) // Ожидаем ошибку, т.к. токен был отозван
                .andExpect(jsonPath("$.error").value("invalid_grant"));
    }

    /**
     * Тест на истечение срока действия OTP.
     * <p>
     * Шаги:
     * 1. Запросить OTP для пользователя.
     * 2. Получить OTP из репозитория.
     * 3. Имитировать истечение срока действия OTP удалив OTP из репозитория.
     * 4. Попытаться обменять OTP на токены.
     * 5. Проверить, что запрос провалился с ошибкой invalid_grant.
     */
    @Test
    void exchangeOtp_whenOtpExpired_shouldReturnBadRequest() throws Exception {
        // 1. Создаем пользователя
        String userPayload = """
                {
                    "email": "expired.otp.user@example.com",
                    "firstName": "Expired",
                    "lastName": "OTP",
                    "city": "Expireville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "expiredotp"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Запрашиваем OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"expired.otp.user@example.com\"}"))
                .andExpect(status().isOk());

        // 3. Получаем OTP из репозитория
        String otp = otpRepository.findOtp("expired.otp.user@example.com")
                .orElseThrow(() -> new AssertionError("OTP не найден"));

        // 4. Имитируем истечение срока действия, удаляя OTP из репозитория
        otpRepository.deleteOtp("expired.otp.user@example.com");

        // 5. Пытаемся обменять истекший OTP на токены
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        params.add("email", "expired.otp.user@example.com");
        params.add("otp", otp);

        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(params)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ=")) // mobile-app:secret в Base64
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));
    }

    /**
     * Превышение количества попыток ввода OTP.
     * <p>
     * Шаги:
     * 1. Создать пользователя, запросить OTP.
     * 2. В цикле отправить 3 запроса (согласно app.otp.max-attempts: 3)
     * на /oauth2/token с неверным OTP.
     * 3. Отправить запрос с правильным OTP.
     * 4. Убедиться, что запрос с правильным OTP провалился с ошибкой invalid_grant,
     * потому что после исчерпания попыток OTP должен быть удален.
     */
    @Test
    void exchangeOtp_whenMaxAttemptsExceeded_shouldReturnBadRequest() throws Exception {
        // 1. Создаем пользователя
        String userPayload = """
                {
                    "email": "max.attempts.user@example.com",
                    "firstName": "Max",
                    "lastName": "Attempts",
                    "city": "Attemptsville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "maxattempts"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Запрашиваем OTP
        mockMvc.perform(post("/api/auth/request-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"max.attempts.user@example.com\"}"))
                .andExpect(status().isOk());

        // 3. Получаем правильный OTP из репозитория
        String correctOtp = otpRepository.findOtp("max.attempts.user@example.com")
                .orElseThrow(() -> new AssertionError("OTP не найден"));

        // 4. Отправляем 3 запроса с неверным OTP (исчерпываем попытки)
        MultiValueMap<String, String> wrongParams = new LinkedMultiValueMap<>();
        wrongParams.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        wrongParams.add("email", "max.attempts.user@example.com");
        wrongParams.add("otp", "0000"); // Заведомо неверный OTP

        // Первая попытка с неверным OTP
        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(wrongParams)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ="))
                .andExpect(status().isBadRequest());

        // Вторая попытка с неверным OTP
        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(wrongParams)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ="))
                .andExpect(status().isBadRequest());

        // Третья попытка с неверным OTP
        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(wrongParams)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ="))
                .andExpect(status().isBadRequest());

        // 5. Пытаемся использовать правильный OTP, но должны получить ошибку,
        // так как все попытки уже исчерпаны
        MultiValueMap<String, String> correctParams = new LinkedMultiValueMap<>();
        correctParams.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        correctParams.add("email", "max.attempts.user@example.com");
        correctParams.add("otp", correctOtp);

        mockMvc.perform(post("/oauth2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .params(correctParams)
                .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ="))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));
    }
}
