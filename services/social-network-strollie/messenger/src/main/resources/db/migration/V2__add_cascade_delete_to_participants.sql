ALTER TABLE participants_t
ADD CONSTRAINT fk_participants_chat
FOREIGN KEY (chat_id)
REFERENCES chat_t (chat_id)
ON DELETE CASCADE;