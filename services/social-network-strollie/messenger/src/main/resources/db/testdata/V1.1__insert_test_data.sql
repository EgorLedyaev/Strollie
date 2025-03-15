-- Вставка данных без использования uuid_generate_v4()
INSERT INTO chat_t (chat_id, author_id, chat_name)
VALUES ('b1a1f5b7-8d77-469d-b0a7-18ad3c2bc9e1', 'b6b20be3-d017-43f5-ae7c-2edbfc86d3e1', 'General Chat'),
       ('b6c38c5b-5f57-47b4-bcde-960f9c1a6dfb', 'b6b20be3-d017-43f5-ae7c-2edbfc86d3e1', 'Tech Discussion'),
       ('24b88859-6fc2-4849-b945-ff9a65a55857', 'b6b20be3-d017-43f5-ae7c-2edbfc86d3e1', 'Project X');

INSERT INTO participants_t (chat_id, user_id)
VALUES ('b1a1f5b7-8d77-469d-b0a7-18ad3c2bc9e1', 'f4ec1db4-bf8e-44c0-9bb5-f7c900197ef2'),
       ('b6c38c5b-5f57-47b4-bcde-960f9c1a6dfb', 'f4ec1db4-bf8e-44c0-9bb5-f7c900197ef2'),
       ('24b88859-6fc2-4849-b945-ff9a65a55857', 'f4ec1db4-bf8e-44c0-9bb5-f7c900197ef2');

INSERT INTO messages_t (user_id, chat_id, text, created_at)
VALUES ('f4ec1db4-bf8e-44c0-9bb5-f7c900197ef2', 'b1a1f5b7-8d77-469d-b0a7-18ad3c2bc9e1',
        'Hello, this is a general message', CURRENT_TIMESTAMP),
       ('f4ec1db4-bf8e-44c0-9bb5-f7c900197ef2', 'b6c38c5b-5f57-47b4-bcde-960f9c1a6dfb', 'Lets talk about microservices',
        CURRENT_TIMESTAMP),
       ('f4ec1db4-bf8e-44c0-9bb5-f7c900197ef2', '24b88859-6fc2-4849-b945-ff9a65a55857',
        'This is an update on Project X', CURRENT_TIMESTAMP);
