package ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp;

import java.util.List;
import java.util.UUID;

import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Компонент для подготовки тестовых данных
 * Использует прямые SQL-запросы для избежания проблем с оптимистичными
 * блокировками
 */
@Component
@Profile("test")
public class TestDataPreparer {

    private final JdbcTemplate jdbcTemplate;
    private static final String TEST_EMAIL_PREFIX = "test-";

    public TestDataPreparer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Создает тестового пользователя напрямую через SQL
     * 
     * @param email email пользователя
     * @return id созданного пользователя
     */
    public UUID createTestUser(String email) {
        UUID userId = UUID.randomUUID();
        jdbcTemplate.update(
                "INSERT INTO users (id, nickname, email, password, first_name, last_name, city, date_of_birth, enabled, account_non_expired, "
                        +
                        "account_non_locked, credentials_non_expired, version) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                        "ON CONFLICT (email) DO NOTHING",
                userId, email, email, "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG",
                "Test", "User", "Test City", java.sql.Date.valueOf("2000-01-01"),
                true, true, true, true, 0);

        // Добавляем роль пользователя
        jdbcTemplate.update(
                "INSERT INTO user_roles (user_id, role) VALUES (?, ?) ON CONFLICT DO NOTHING",
                userId, "ROLE_USER");

        return userId;
    }

    /**
     * Очищает тестовые данные, созданные во время тестов.
     * Этот метод не должен использоваться при наличии @Transactional аннотации на
     * тестовом классе,
     * так как данные будут автоматически откатываться после каждого теста.
     */
    public void cleanTestData() {
        // Удаляем всех тестовых пользователей
        List<UUID> testUserIds = jdbcTemplate.queryForList(
                "SELECT id FROM users WHERE email LIKE ?",
                UUID.class,
                TEST_EMAIL_PREFIX + "%@example.com");

        if (!testUserIds.isEmpty()) {
            // Удаляем связанные роли
            jdbcTemplate.update(
                    "DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE email LIKE ?)",
                    TEST_EMAIL_PREFIX + "%@example.com");

            // Удаляем пользователей
            jdbcTemplate.update(
                    "DELETE FROM users WHERE email LIKE ?",
                    TEST_EMAIL_PREFIX + "%@example.com");
        }
    }
}
