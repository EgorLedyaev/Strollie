-- Добавляем колонку последней активности в таблицу чатов
ALTER TABLE chat_t
ADD COLUMN last_activity_at TIMESTAMP;

-- Обновляем существующие чаты текущей датой
UPDATE chat_t
SET last_activity_at = CURRENT_TIMESTAMP
WHERE last_activity_at IS NULL;

-- Делаем колонку NOT NULL после заполнения всех значений
ALTER TABLE chat_t
ALTER COLUMN last_activity_at SET NOT NULL;

-- Создаем триггер для автоматического обновления last_activity_at при новых сообщениях
CREATE OR REPLACE FUNCTION update_chat_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_t
    SET last_activity_at = CURRENT_TIMESTAMP
    WHERE chat_id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_created_trigger
AFTER INSERT ON messages_t
FOR EACH ROW
EXECUTE FUNCTION update_chat_last_activity();