package ru.riveo.strollie.authorization_server.config;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;

/**
 * Тесты для проверки очистки Redis между тестами
 */
public class RedisCleanupTests extends ApiIntegrationTest {

    @Autowired
    private OtpRepository otpRepository;

    /**
     * Тест проверки очистки Redis между тестами.
     * <p>
     * Цель: Убедиться, что данные в Redis очищаются между тестами, и один тест
     * не влияет на другой.
     * <p>
     * Шаги:
     * 1. Создать пользователя с уникальным email.
     * 2. Запросить OTP для этого пользователя.
     * 3. Проверить, что OTP сохранен в Redis.
     * 4. Вызвать метод очистки Redis, который выполняется между тестами.
     * 5. Проверить, что OTP больше не доступен в Redis.
     */
    @Test
    void cleanup_shouldRemoveAllKeysFromRedis() throws Exception {
        // 1. Создаем пользователя
        String email = "redis.cleanup.test@example.com";
        String userPayload = """
                {
                    "email": "redis.cleanup.test@example.com",
                    "firstName": "Redis",
                    "lastName": "Cleanup",
                    "city": "Redisville",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "rediscleanup"
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

        // 3. Проверяем, что OTP сохранен в Redis
        assertTrue(otpRepository.findOtp(email).isPresent(),
                "OTP должен быть доступен в Redis после запроса");

        // 4. Вызываем метод очистки Redis
        cleanup();

        // 5. Проверяем, что OTP больше не доступен в Redis
        assertTrue(otpRepository.findOtp(email).isEmpty(),
                "OTP не должен быть доступен в Redis после очистки");
    }
}
