# **Authorization Server: Техническая Документация и Руководство по Эксплуатации**

## 1. Обзор Системы

Этот проект представляет собой production-ready **сервер авторизации OAuth 2.0**, реализованный на стеке **Spring Boot 3**, **Spring Security 6** и **Spring Authorization Server**.

Основная бизнес-задача — предоставление безопасной, беспарольной аутентификации для клиентских приложений (мобильных, веб) с использованием одноразовых паролей (OTP), отправляемых по электронной почте.

Система реализует кастомный тип предоставления авторизации (grant type) `urn:ietf:params:oauth:grant-type:otp`, полностью интегрированный в стандартный поток OAuth 2.0.

### 1.1. Архитектура

Проект построен в соответствии с принципами **Vertical Slice Architecture (VSA)**. Код организован не по техническим слоям (`controller`, `service`), а по бизнес-возможностям (`features`).

* **`features`**: Каждый пакет внутри содержит все компоненты, необходимые для реализации одной конкретной функции (например, `/passwordless_auth/request_otp`). Это обеспечивает высокую связанность внутри фичи и низкое зацепление между ними.
* **`shared`**: Содержит кросс-функциональный код: доменные модели, общие интерфейсы репозиториев и конфигурацию безопасности.
* **`infrastructure`**: Содержит реализации интерфейсов из других слоев, привязанные к конкретным технологиям (JPA, Redis, SMTP).

### 1.2. Технологический Стек

* **Язык/Платформа:** Java 17, Spring Boot 3
* **Безопасность:** Spring Security 6, Spring Authorization Server
* **База данных:** PostgreSQL
* **Миграции БД:** Flyway
* **Кэш (OTP):** Redis
* **Отправка почты:** Spring Mail (локально через MailHog)
* **Сборка:** Gradle
* **Контейнеризация:** Docker, Docker Compose
* **Тестирование:** JUnit 5, MockMvc, Testcontainers

## 2. Предварительные Требования

Для локального развертывания и разработки необходимо следующее ПО:

* **Git**
* **JDK 17** (Amazon Corretto, Eclipse Temurin или аналогичный)
* **Docker** и **Docker Compose**

## 3. Развертывание и Запуск

### 3.1. Создание Хранилища Ключей (Keystore)

Сервер использует асимметричное шифрование RSA для подписи JWT-токенов. Ключи должны храниться в JKS (Java KeyStore). **Этот шаг выполняется один раз.**

1. Перейдите в директорию `src/main/resources/`.
2. Создайте папку `keystore`.
3. Выполните команду для генерации файла `keystore.jks`:

    ```bash
    keytool -genkeypair -alias jwt-signing-key -keyalg RSA -storetype JKS -keystore src/main/resources/keystore/keystore.jks -keysize 2048 -storepass <your-strong-store-password> -keypass <your-strong-key-password>
    ```

    * **`-alias jwt-signing-key`**: Псевдоним ключа.
    * **`-keystore keystore/keystore.jks`**: Путь к файлу хранилища.
    * **`-storepass <your-strong-store-password>`**: Пароль от хранилища.
    * **`-keypass <your-strong-key-password>`**: Пароль от приватного ключа.

    **Внимание:** Эти значения **должны** совпадать со значениями в `application.yaml`. Для production-среды используйте надежные, сгенерированные пароли, управляемые через секреты.

### 3.2. Конфигурация

Все основные параметры настраиваются в файле `src/main/resources/application.yaml`. Ключевые секции: `spring`, `app`, `authorization`. Для production-среды эти параметры должны переопределяться через переменные окружения или внешние конфигурационные файлы.

### 3.3. Запуск Среды

Проект полностью контейнеризован. Запуск всех сервисов (приложение, PostgreSQL, Redis, MailHog) осуществляется одной командой из корневой директории проекта:

```bash
docker-compose up --build
```

* `--build` требуется только при первом запуске или после изменения исходного кода/Dockerfile.

После успешного запуска будут доступны следующие сервисы:

* **Authorization Server:** `http://localhost:9100`
* **PostgreSQL:** `localhost:5432`
* **Redis:** `localhost:6379`
* **MailHog (Web UI):** `http://localhost:8025`

## 4. Сценарии Использования API

Взаимодействие с сервером строится вокруг двух основных сценариев: **регистрация нового пользователя** и **последующий вход в систему**. Процессы спроектированы так, чтобы быть последовательными: сначала регистрация, затем вход.

### 4.1. Сценарий: Регистрация и Первый Вход

Этот сценарий предназначен для новых пользователей, которые впервые взаимодействуют с приложением. Он состоит из трех обязательных шагов.

#### **Шаг 1: Регистрация пользователя**

Клиентское приложение собирает все данные о пользователе и отправляет их на эндпоинт регистрации.

* **Endpoint:** `POST /api/users/register`
* **Content-Type:** `application/json`
* **Body:**

    ```json
    {
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов",
      "city": "Москва",
      "dateOfBirth": "1990-01-25",
      "nickname": "ivan_the_tester"
    }
    ```

**Пример (cURL):**

```bash
curl -X POST http://localhost:9100/api/users/register \
-H "Content-Type: application/json" \
-d '{
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Иванов",
    "city": "Москва",
    "dateOfBirth": "1990-01-25",
    "nickname": "ivan_the_tester"
}'
```

**Результат:**

* **`201 Created`**: Пользователь успешно создан.
* **`400 Bad Request`**: Ошибка валидации. Одно из полей не заполнено или имеет неверный формат. Тело ответа будет содержать детали.
* **`500 Internal Server Error`**: Пользователь с таким `email` или `nickname` уже существует.

#### **Шаг 2: Запрос одноразового пароля (OTP)**

**Сразу после успешной регистрации**, клиентское приложение должно инициировать вход, отправляя email только что зарегистрированного пользователя на эндпоинт запроса OTP.

* **Endpoint:** `POST /api/auth/request-otp`
* **Content-Type:** `application/json`
* **Body:**

    ```json
    {
      "email": "user@example.com"
    }
    ```

**Пример (cURL):**

```bash
curl -X POST http://localhost:9100/api/auth/request-otp \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com"}'
```

**Результат:**

* **`200 OK`**: Успешно. Письмо с OTP отправлено. Для локальной разработки его можно просмотреть в MailHog (`http://localhost:8025`).
* **`429 Too Many Requests`**: Слишком частые запросы для данного email.

#### **Шаг 3: Обмен OTP на токены доступа**

Пользователь вводит полученный OTP. Приложение обменивает его на `access_token` и `refresh_token`, обращаясь к стандартному эндпоинту OAuth 2.0.

* **Endpoint:** `POST /oauth2/token`
* **Content-Type:** `application/x-www-form-urlencoded`
* **Аутентификация клиента:** Basic Auth. `Authorization: Basic <base64(client_id:client_secret)>`.
* **Параметры формы (form parameters):**
  * `grant_type`: `urn:ietf:params:oauth:grant-type:otp`
  * `email`: Email пользователя.
  * `otp`: Одноразовый пароль из письма.

**Пример (cURL):**
*Для клиента `mobile-app` с секретом `secret` (из миграции `V2`):*

```bash
curl -X POST http://localhost:9100/oauth2/token \
-H "Content-Type: application/x-www-form-urlencoded" \
-u "mobile-app:secret" \
-d "grant_type=urn:ietf:params:oauth:grant-type:otp&email=user@example.com&otp=КОД_ИЗ_ПИСЬМА"
```

**Результат (успех):**
Стандартный ответ OAuth 2.0 с токенами.

```json
{
    "access_token": "eyJhbGciOiJSUzI1NiJ9...",
    "refresh_token": "eFTs4fL_2K...",
    "scope": "openid message.read profile",
    "token_type": "Bearer",
    "expires_in": 3599
}
```

**Результат (ошибка):**
Стандартный ответ OAuth 2.0 с ошибкой `invalid_grant`, если OTP неверный, истек или пользователь не существует.

```json
{
    "error": "invalid_grant",
    "error_description": "..."
}
```

### 4.2. Сценарий: Повторный вход

Для уже зарегистрированного пользователя процесс входа состоит только из Шага 2 и Шага 3, описанных выше.

---

## 5. Управление Базой Данных

Схема базы данных управляется с помощью **Flyway**.

* **Расположение миграций:** `src/main/resources/db/migration`
* **Порядок применения:** Файлы выполняются в лексикографическом порядке их имен (V1, V2, V3...).
* **`V1`**: Создает таблицы, необходимые для Spring Authorization Server.
* **`V2`**: Создает двух OAuth2-клиентов: `spa-client` и `mobile-app`.
* **`V3`**: Создает таблицы для пользователей приложения (`users`, `user_roles`).
* **`V4`**: Добавляет столбец `version` для оптимистичной блокировки.
* **`V5`**: Расширяет таблицу `users` обязательными полями профиля (`firstName`, `lastName`, `city`, `dateOfBirth`) и переименовывает `username` в `nickname` в соответствии с бизнес-требованиями.

**Внимание:** Никогда не изменяйте уже примененные миграции. Для любых изменений схемы создавайте новый файл миграции.
