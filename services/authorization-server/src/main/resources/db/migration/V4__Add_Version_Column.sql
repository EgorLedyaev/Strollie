-- Добавление столбца version для оптимистичной блокировки
ALTER TABLE users ADD COLUMN version BIGINT DEFAULT 0;
