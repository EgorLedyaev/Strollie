-- Создаем пользователя-администратора из переменных среды
INSERT INTO users (id, email, nickname, password, first_name, last_name, city, date_of_birth, enabled, account_non_expired, account_non_locked, credentials_non_expired, version)
VALUES (
    'a1b2c3d4-e5f6-7890-1234-567890abcdef', -- Фиксированный UUID для администратора
    '${admin_email}',
    '${admin_nickname}',
    '${admin_password_hash}',
    'Admin',
    'User',
    'System',
    '2025-01-01',
    true, true, true, true, 0
) ON CONFLICT (id) DO NOTHING;

-- Присваиваем роли USER и ADMIN
INSERT INTO user_roles (user_id, role) VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role) VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'ROLE_ADMIN') ON CONFLICT DO NOTHING;
