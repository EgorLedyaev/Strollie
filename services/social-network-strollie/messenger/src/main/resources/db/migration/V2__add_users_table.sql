-- V2__add_users_table.sql

-- Создание таблицы пользователей
CREATE TABLE users
(
    user_id UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE
);

-- Добавление внешнего ключа в chat_t.author_id
ALTER TABLE chat_t
    ADD CONSTRAINT fk_chat_author
        FOREIGN KEY (author_id) REFERENCES users(user_id)
            ON DELETE CASCADE;

-- Добавление внешнего ключа в participants_t.user_id
ALTER TABLE participants_t
    ADD CONSTRAINT fk_participant_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
            ON DELETE CASCADE;

-- Добавление внешнего ключа в message_t.sender_id
ALTER TABLE message_t
    ADD CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id) REFERENCES users(user_id)
            ON DELETE SET NULL;
