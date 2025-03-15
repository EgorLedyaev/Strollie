CREATE TABLE chat_t
(
    chat_id UUID PRIMARY KEY,
    author_id UUID NOT NULL,
    chat_name VARCHAR(50) UNIQUE
);

CREATE TABLE participants_t
(
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE messages_t
(
    message_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    chat_id UUID NOT NULL,
    text VARCHAR(1200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edit_at TIMESTAMP,
    deleted_at TIMESTAMP
);
