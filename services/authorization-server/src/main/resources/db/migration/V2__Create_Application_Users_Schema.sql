CREATE TABLE IF NOT EXISTS users
(
    id                        UUID PRIMARY KEY,
    nickname                  VARCHAR(255) UNIQUE NOT NULL,
    email                     VARCHAR(255) UNIQUE NOT NULL,
    first_name                VARCHAR(255)        NOT NULL,
    last_name                 VARCHAR(255)        NOT NULL,
    city                      VARCHAR(255)        NOT NULL,
    date_of_birth             DATE                NOT NULL,

    -- Стандартные поля Spring Security для управления состоянием аккаунта.
    enabled                   BOOLEAN             NOT NULL DEFAULT TRUE,
    account_non_expired       BOOLEAN             NOT NULL DEFAULT TRUE,
    account_non_locked        BOOLEAN             NOT NULL DEFAULT TRUE,
    credentials_non_expired   BOOLEAN             NOT NULL DEFAULT TRUE,

    version                   BIGINT              NOT NULL DEFAULT 0

    -- ВНИМАНИЕ: НЕТ ПОЛЯ 'password'. Система БЕСПАРОЛЬНАЯ.
    );

-- Таблица для ролей пользователей.
CREATE TABLE IF NOT EXISTS user_roles
(
    user_id UUID         NOT NULL REFERENCES users (id),
    role    VARCHAR(50)  NOT NULL,
    PRIMARY KEY (user_id, role)
    );