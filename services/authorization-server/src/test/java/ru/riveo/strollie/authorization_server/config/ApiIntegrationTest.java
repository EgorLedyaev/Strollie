package ru.riveo.strollie.authorization_server.config;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
public abstract class ApiIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    private StringRedisTemplate redisTemplate;


    @BeforeEach
    public void cleanup() {
        // Очистка PostgreSQL
        // Отключаем ограничения внешних ключей перед очисткой
        jdbcTemplate.execute("SET CONSTRAINTS ALL DEFERRED");
        // Очищаем таблицы
        jdbcTemplate.execute("DELETE FROM user_roles");
        jdbcTemplate.execute("DELETE FROM users");
        // Снова включаем ограничения
        jdbcTemplate.execute("SET CONSTRAINTS ALL IMMEDIATE");

        // Очистка Redis
        Assertions.assertNotNull(redisTemplate.getConnectionFactory());
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }
}
