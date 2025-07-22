-- Добавляем новые обязательные поля для профиля пользователя
ALTER TABLE users ADD COLUMN first_name VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN last_name VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN city VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN date_of_birth DATE NOT NULL DEFAULT '2000-01-01';

-- Ваш никнейм должен быть уникальным, иначе это бессмысленно.
-- Также, я переименую существующий `username` в `nickname`, чтобы соответствовать вашему макету
ALTER TABLE users RENAME COLUMN username TO nickname;
-- Добавление уникального ключа уже не нужно, т.к. никнейм уже был уникальным как username

-- Поле password вам больше не нужно, но удалять его может быть опасно.
-- Сделаем его необязательным (nullable), чтобы оно не мешалось.
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Удалим временные дефолтные значения
ALTER TABLE users ALTER COLUMN first_name DROP DEFAULT;
ALTER TABLE users ALTER COLUMN last_name DROP DEFAULT;
ALTER TABLE users ALTER COLUMN city DROP DEFAULT;
ALTER TABLE users ALTER COLUMN date_of_birth DROP DEFAULT;
