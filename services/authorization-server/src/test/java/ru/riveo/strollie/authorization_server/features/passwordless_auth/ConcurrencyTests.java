package ru.riveo.strollie.authorization_server.features.passwordless_auth;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ru.riveo.strollie.authorization_server.config.ApiIntegrationTest;

/**
 * Тесты на проверку конкурентного доступа к API
 */
public class ConcurrencyTests extends ApiIntegrationTest {

    /**
     * Тест на Race Condition при запросе OTP.
     * <p>
     * Запускает 20+ параллельных потоков, одновременно запрашивающих OTP для одного
     * и того же email.
     * Только ОДИН запрос должен успешно инициировать отправку письма (200 OK).
     * Все остальные должны получить 429 Too Many Requests.
     */
    @Test
    void requestOtp_whenParallelRequests_shouldRateLimit() throws Exception {
        // Количество параллельных запросов
        int threadCount = 25;

        // 1. Создаем пользователя
        String userPayload = """
                {
                    "email": "concurrent.user@example.com",
                    "firstName": "Concurrent",
                    "lastName": "User",
                    "city": "Concurrency",
                    "dateOfBirth": "2000-01-01",
                    "nickname": "concurrentuser"
                }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Настраиваем многопоточное выполнение запросов
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger rateLimitCount = new AtomicInteger(0);

        List<Future<MvcResult>> futures = new ArrayList<>();

        // 3. Запускаем параллельные запросы
        for (int i = 0; i < threadCount; i++) {
            futures.add(executor.submit(() -> {
                // Все потоки ждут сигнала для одновременного выполнения запросов
                latch.await();

                // Выполняем запрос
                MvcResult result = mockMvc.perform(post("/api/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"concurrent.user@example.com\"}"))
                        .andReturn();

                // Подсчитываем успешные и заблокированные запросы
                if (result.getResponse().getStatus() == 200) {
                    successCount.incrementAndGet();
                } else if (result.getResponse().getStatus() == 429) {
                    rateLimitCount.incrementAndGet();
                }

                return result;
            }));
        }

        // 4. Даем сигнал всем потокам начать выполнение одновременно
        latch.countDown();

        // 5. Ждем завершения всех запросов
        for (Future<MvcResult> future : futures) {
            future.get();
        }

        executor.shutdown();

        // 6. Проверяем, что только один запрос был успешным
        assertEquals(1, successCount.get(), "Только один запрос должен вернуть 200 OK");
        assertEquals(threadCount - 1, rateLimitCount.get(),
                "Все остальные запросы должны вернуть 429 Too Many Requests");

        // 7. Проверяем, что письмо было отправлено только один раз
        verify(javaMailSender, times(1))
                .send(org.mockito.ArgumentMatchers.any(org.springframework.mail.SimpleMailMessage.class));
    }
}
