-- Создание таблицы чатов
CREATE TABLE chat_t
(
    chat_id          UUID PRIMARY KEY,
    author_id        UUID      NOT NULL,
    chat_name        VARCHAR(50),
    last_activity_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- Предполагается, что author_id ссылается на users, добавьте внешний ключ, если есть таблица users
    -- FOREIGN KEY (author_id) REFERENCES users(user_id)
);

-- Создание таблицы участников чатов
CREATE TABLE participants_t
(
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (chat_id, user_id),
    CONSTRAINT fk_participants_chat FOREIGN KEY (chat_id)
        REFERENCES chat_t (chat_id)
        ON DELETE CASCADE
    -- , FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Создание таблицы сообщений
CREATE TABLE message_t
(
    message_id UUID PRIMARY KEY,
    sender_id  UUID          NOT NULL,
    chat_id    UUID          NOT NULL,
    content    VARCHAR(1200) NOT NULL,
    timestamp  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_chat FOREIGN KEY (chat_id)
        REFERENCES chat_t (chat_id)
        ON DELETE CASCADE
    -- , FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Создание функции для обновления времени последней активности чата
CREATE OR REPLACE FUNCTION update_chat_last_activity()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE chat_t
    SET last_activity_at = NEW.timestamp
    WHERE chat_id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Удаление старого триггера, если он существует
DROP TRIGGER IF EXISTS message_created_trigger ON message_t;

-- Создание нового триггера на вставку сообщений
CREATE TRIGGER message_created_trigger
    AFTER INSERT
    ON message_t
    FOR EACH ROW
EXECUTE FUNCTION update_chat_last_activity();
