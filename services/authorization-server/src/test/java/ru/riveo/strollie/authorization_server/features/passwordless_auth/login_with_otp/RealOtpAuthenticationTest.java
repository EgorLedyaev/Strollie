package ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import ru.riveo.strollie.authorization_server.config.BaseIntegrationTest;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;

@AutoConfigureMockMvc
@ActiveProfiles("real-otp") // Активируем профиль с реальным OTP
@Import(RealOtpTestConfiguration.class)
@Transactional // Оборачиваем каждый тест в транзакцию для автоматического отката
class RealOtpAuthenticationTest extends BaseIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private OtpRepository otpRepository;

        private static final String TEST_EMAIL_PREFIX = "test-real-";
        private static final String TEST_CLIENT_ID = "mobile-app";
        private static final String TEST_CLIENT_SECRET = "secret";

        private String testEmail;

        @Autowired
        private TestDataPreparer testDataPreparer;

        /**
         * Создаем тестового пользователя для текущего теста.
         * В транзакционных тестах эта операция будет откатываться автоматически.
         * Для тестов с особыми требованиями можно создавать пользователей внутри метода
         * теста.
         */
        @BeforeEach
        public void setUp() {
                // Создаем уникальный email и пользователя для теста
                testEmail = TEST_EMAIL_PREFIX + UUID.randomUUID().toString() + "@example.com";
                testDataPreparer.createTestUser(testEmail);
        }

        // Метод tearDown удален, поскольку аннотация @Transactional
        // обеспечивает автоматический откат всех изменений в базе данных

        @Test
        void fullPasswordlessFlow_Success() throws Exception {
                // === Шаг 1: Запрос OTP (Act 1) ===
                mockMvc.perform(post("/api/auth/request-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\": \"" + testEmail + "\"}"))
                                .andExpect(status().isOk());

                // === Шаг 2: Извлечение OTP из Redis для теста (Arrange 2) ===
                String otp = otpRepository.findOtp(testEmail)
                                .orElseThrow(() -> new AssertionError(
                                                "OTP not found in Redis for email: " + testEmail));

                // === Шаг 3: Обмен OTP на токен (Act 2) ===
                MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
                params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
                params.add("email", testEmail);
                params.add("otp", otp);

                // === Шаг 4: Проверка результата (Assert) ===
                mockMvc.perform(post("/oauth2/token")
                                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                                .params(params)
                                .header("Authorization", "Basic " +
                                                java.util.Base64.getEncoder()
                                                                .encodeToString((TEST_CLIENT_ID + ":"
                                                                                + TEST_CLIENT_SECRET).getBytes())))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.access_token").exists())
                                .andExpect(jsonPath("$.token_type").value("Bearer"));
        }

        @Test
        void fullPasswordlessFlow_InvalidOtp() throws Exception {
                // === Шаг 1: Запрос OTP (Act 1) ===
                mockMvc.perform(post("/api/auth/request-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\": \"" + testEmail + "\"}"))
                                .andExpect(status().isOk());

                // === Шаг 2: Проверяем, что OTP действительно создано в Redis ===
                otpRepository.findOtp(testEmail)
                                .orElseThrow(() -> new AssertionError(
                                                "OTP not found in Redis for email: " + testEmail));

                // === Шаг 3: Обмен неверного OTP на токен (Act 2) ===
                MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
                params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
                params.add("email", testEmail);
                params.add("otp", "0000"); // неправильный OTP, отличный от realOtp

                // === Шаг 4: Проверка результата (Assert) ===
                mockMvc.perform(post("/oauth2/token")
                                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                                .params(params)
                                .header("Authorization", "Basic " +
                                                java.util.Base64.getEncoder()
                                                                .encodeToString((TEST_CLIENT_ID + ":"
                                                                                + TEST_CLIENT_SECRET).getBytes())))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.error").value("invalid_grant"));
        }

        @Test
        void fullPasswordlessFlow_ExceededAttempts() throws Exception {
                // === Шаг 1: Запрос OTP ===
                mockMvc.perform(post("/api/auth/request-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\": \"" + testEmail + "\"}"))
                                .andExpect(status().isOk());

                // === Шаг 2: Проверяем, что OTP создано в Redis, и модифицируем настройки
                // попыток ===
                otpRepository.findOtp(testEmail)
                                .orElseThrow(() -> new AssertionError(
                                                "OTP not found in Redis for email: " + testEmail));

                // Модифицируем количество попыток, оставляя только одну
                otpRepository.setInitialAttempts(testEmail, 1, 5);

                // === Шаг 3: Создаем параметры запроса с неверным OTP ===
                MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
                params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
                params.add("email", testEmail);
                params.add("otp", "0000"); // неправильный OTP

                // === Шаг 4: Первая попытка - должна быть неудачной, но не исчерпывающей лимит
                // ===
                mockMvc.perform(post("/oauth2/token")
                                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                                .params(params)
                                .header("Authorization", "Basic " +
                                                java.util.Base64.getEncoder()
                                                                .encodeToString((TEST_CLIENT_ID + ":"
                                                                                + TEST_CLIENT_SECRET).getBytes())))
                                .andExpect(status().isBadRequest());

                // === Шаг 5: Вторая попытка - должна быть неудачной и возвращать ошибку
                // исчерпания попыток ===
                mockMvc.perform(post("/oauth2/token")
                                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                                .params(params)
                                .header("Authorization", "Basic " +
                                                java.util.Base64.getEncoder()
                                                                .encodeToString((TEST_CLIENT_ID + ":"
                                                                                + TEST_CLIENT_SECRET).getBytes())))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.error").value("invalid_grant"));
        }

        @Test
        void fullPasswordlessFlow_NonExistentUser() throws Exception {
                // === Шаг 1: Создаем уникальный email, которого нет в системе ===
                String nonExistentEmail = "nonexistent-" + UUID.randomUUID().toString() + "@example.com";

                // === Шаг 2: Запрашиваем OTP для несуществующего пользователя ===
                mockMvc.perform(post("/api/auth/request-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"email\": \"" + nonExistentEmail + "\"}"))
                                .andExpect(status().isOk()); // API не должен раскрывать существование пользователя

                // === Шаг 3: Пытаемся обменять OTP на токен (с любым OTP) ===
                MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
                params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
                params.add("email", nonExistentEmail);
                params.add("otp", "1234"); // произвольный OTP

                // === Шаг 4: Проверяем неудачную аутентификацию ===
                mockMvc.perform(post("/oauth2/token")
                                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                                .params(params)
                                .header("Authorization", "Basic " +
                                                java.util.Base64.getEncoder()
                                                                .encodeToString((TEST_CLIENT_ID + ":"
                                                                                + TEST_CLIENT_SECRET).getBytes())))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.error").value("invalid_grant"));
        }
}
