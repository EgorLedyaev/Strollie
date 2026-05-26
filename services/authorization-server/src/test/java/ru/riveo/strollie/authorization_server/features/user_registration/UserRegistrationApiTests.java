package ru.riveo.strollie.authorization_server.features.user_registration;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ru.riveo.strollie.authorization_server.config.ApiIntegrationTest;

public class UserRegistrationApiTests extends ApiIntegrationTest {

    @Test
    void registerNewUser_whenDataIsValid_shouldReturnCreated() throws Exception {
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
    }

    @Test
    void registerNewUser_whenEmailAlreadyExists_shouldReturnConflict() throws Exception {
        // Сначала создаем пользователя
        String firstUserPayload = """
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
                .content(firstUserPayload))
                .andExpect(status().isCreated());

        // Пытаемся создать его снова с тем же email
        String duplicateUserPayload = """
                    {
                        "email": "test.user@example.com",
                        "firstName": "Another",
                        "lastName": "User",
                        "city": "Anotherville",
                        "dateOfBirth": "2001-01-01",
                        "nickname": "anotheruser"
                    }
                """;

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(duplicateUserPayload))
                .andExpect(status().isConflict());
    }

    /**
     Регистрация с дублирующимся никнеймом.
     * <p>
     * Шаги:
     * 1. Создать первого пользователя.
     * 2. Попытаться создать второго пользователя с другим email, но с тем же
     * nickname.
     * 3. Проверить, что ответ сервера - 409 Conflict, т.е. никнейм уже занят.
     */
    @Test
    void registerNewUser_whenNicknameAlreadyExists_shouldReturnConflict() throws Exception {
        // 1. Создаем первого пользователя
        String firstUserPayload = """
                    {
                        "email": "first.user@example.com",
                        "firstName": "First",
                        "lastName": "User",
                        "city": "Firstville",
                        "dateOfBirth": "2000-01-01",
                        "nickname": "duplicatenick"
                    }
                """;

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(firstUserPayload))
                .andExpect(status().isCreated());

        // 2. Пытаемся создать второго пользователя с тем же nickname
        String duplicateNicknamePayload = """
                    {
                        "email": "second.user@example.com",
                        "firstName": "Second",
                        "lastName": "User",
                        "city": "Secondville",
                        "dateOfBirth": "2001-01-01",
                        "nickname": "duplicatenick"
                    }
                """;

        // 3. Проверяем, что получаем ошибку
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(duplicateNicknamePayload))
                .andExpect(status().isConflict());
    }

    /**
     Регистрация с невалидными данными.
     * <p>
     * Шаги:
     * 1. Отправить запрос на /api/users/register с заведомо невалидным телом:
     * пустой email, некорректный email, дата рождения в будущем, пустые имена и
     * т.д.
     * 2. Убедиться, что на каждый такой запрос сервер отвечает 400 Bad Request.
     */
    @Test
    void registerNewUser_withInvalidData_shouldReturnBadRequest() throws Exception {
        // Тест с пустым email
        String emptyEmailPayload = """
                    {
                        "email": "",
                        "firstName": "Test",
                        "lastName": "User",
                        "city": "Testville",
                        "dateOfBirth": "2000-01-01",
                        "nickname": "testuser"
                    }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(emptyEmailPayload))
                .andExpect(status().isBadRequest());

        // Тест с некорректным email
        String invalidEmailPayload = """
                    {
                        "email": "not-an-email",
                        "firstName": "Test",
                        "lastName": "User",
                        "city": "Testville",
                        "dateOfBirth": "2000-01-01",
                        "nickname": "testuser"
                    }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidEmailPayload))
                .andExpect(status().isBadRequest());

        // Тест с датой рождения в будущем
        String futureDataPayload = """
                    {
                        "email": "future.user@example.com",
                        "firstName": "Future",
                        "lastName": "User",
                        "city": "Futureville",
                        "dateOfBirth": "2030-01-01",
                        "nickname": "futureuser"
                    }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(futureDataPayload))
                .andExpect(status().isBadRequest());

        // Тест с пустым именем
        String emptyFirstNamePayload = """
                    {
                        "email": "empty.name@example.com",
                        "firstName": "",
                        "lastName": "User",
                        "city": "Emptyville",
                        "dateOfBirth": "2000-01-01",
                        "nickname": "emptyuser"
                    }
                """;
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(emptyFirstNamePayload))
                .andExpect(status().isBadRequest());
    }
}
