package ru.riveo.strollie.authorization_server.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;
import ru.riveo.strollie.authorization_server.features.role_management.domain.AccountWithRoles;
import ru.riveo.strollie.authorization_server.features.role_management.port.AccountRepository;
import ru.riveo.strollie.authorization_server.features.user_registration.domain.Registrant;
import ru.riveo.strollie.authorization_server.features.user_registration.port.RegistrantRepository;

/**
 * Вспомогательный класс для работы с пользователями в тестах.
 * Инкапсулирует логику регистрации пользователей и получения токенов.
 */
@Component
public class TestUserHelper {

    @Autowired
    private MockMvc mockMvc;


    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RegistrantRepository registrantRepository;
    @Autowired
    private AccountRepository accountRepository;

    /**
     * Создаёт нового пользователя через API и получает токен авторизации
     *
     * @param email       Email пользователя
     * @param nickname    Никнейм пользователя
     * @param firstName   Имя
     * @param lastName    Фамилия
     * @param city        Город
     * @param dateOfBirth Дата рождения в формате YYYY-MM-DD
     * @return Токен авторизации
     */
    public String createAndAuthenticateUser(
            String email,
            String nickname,
            String firstName,
            String lastName,
            String city,
            String dateOfBirth) throws Exception {

        // 1. Регистрируем пользователя
        String userPayload = String.format(
                """
                        {
                            "email": "%s",
                            "firstName": "%s",
                            "lastName": "%s",
                            "city": "%s",
                            "dateOfBirth": "%s",
                            "nickname": "%s"
                        }
                        """,
                email, firstName, lastName, city, dateOfBirth, nickname);

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userPayload))
                .andExpect(status().isCreated());

        // 2. Получаем токен
        return getAccessTokenForUser(email);
    }

    /**
     * "Божественный" метод для быстрой подготовки администратора.
     * Он напрямую использует бизнес-логику через порты, обходя HTTP.
     * @Transactional гарантирует, что все операции выполнятся в одной транзакции.
     * @return Email созданного администратора для последующего получения токена.
     */
    @Transactional
    public String bootstrapFirstAdmin(String email, String nickname) {
        // Шаг 1: Используем логику регистрации
        var registrant = Registrant.from(
                email, nickname, "Test", "Admin", "BootstrapCity", java.time.LocalDate.now()
        );
        registrantRepository.save(registrant);

        // Шаг 2: Используем логику назначения ролей
        AccountWithRoles adminAccount = accountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Test setup failed: Could not find user after creation"));

        adminAccount.assignRole("ROLE_ADMIN");
        accountRepository.save(adminAccount);

        return email;
    }

    /**
     * Получает токен авторизации для существующего пользователя
     *
     * @param email Email пользователя
     * @return Токен авторизации
     */
    public String getAccessTokenForUser(String email) throws Exception {
        // 1. Запрашиваем OTP
        mockMvc.perform(post("/api/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"" + email + "\"}"))
                .andExpect(status().isOk());

        // 2. Извлекаем OTP
        String otp = otpRepository.findOtp(email)
                .orElseThrow(() -> new AssertionError("OTP not found for: " + email));

        // 3. Обмениваем OTP на токен
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "urn:ietf:params:oauth:grant-type:otp");
        params.add("email", email);
        params.add("otp", otp);

        MvcResult result = mockMvc.perform(post("/oauth2/token")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .params(params)
                        .header("Authorization", "Basic bW9iaWxlLWFwcDpzZWNyZXQ=")) // mobile-app:secret
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").exists())
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        return jsonNode.get("access_token").asText();
    }

    /**
     * Повышает права существующего пользователя до указанной роли, используя API.
     * Требует токен администратора для выполнения операции.
     *
     * @param targetUserEmail     Email пользователя, которому назначается роль.
     * @param role                Назначаемая роль (например, "ROLE_ADMIN").
     * @param performerAdminToken Токен администратора, выполняющего операцию.
     */
    public void assignRoleUsingApi(String targetUserEmail, String role, String performerAdminToken) throws Exception {
        String rolePayload = String.format("""
                {
                    "email": "%s",
                    "role": "%s"
                }
                """, targetUserEmail, role);

        mockMvc.perform(post("/api/admin/roles/assign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + performerAdminToken)
                        .content(rolePayload))
                .andExpect(status().isOk());
    }
}
