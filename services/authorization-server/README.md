# **Authorization Server: Техническая Документация и Руководство по Эксплуатации**

[![Build Status](https://github.com/CrucifiedOnTheCross/Authorization_Server/actions/workflows/ci.yml/badge.svg)](https://github.com/CrucifiedOnTheCross/Authorization_Server/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/CrucifiedOnTheCross/Authorization_Server/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/CrucifiedOnTheCross/Authorization_Server)
[![Docker](https://img.shields.io/badge/Docker-enabled-blue)]

## 1. Обзор Системы

Этот проект представляет собой **сервер авторизации OAuth 2.0**, реализованный на стеке **Spring Boot 3**, **Spring Security 6** и **Spring Authorization Server**.

Основная бизнес-задача — предоставление безопасной, беспарольной аутентификации для клиентских приложений (мобильных, веб) с использованием одноразовых паролей (OTP), отправляемых по электронной почте.

Система реализует кастомный тип предоставления авторизации (grant type) `urn:ietf:params:oauth:grant-type:otp`, полностью интегрированный в стандартный поток OAuth 2.0.

### 1.1. Архитектура

Проект построен в соответствии с принципами **Vertical Slice Architecture (VSA)**. Код организован не по техническим слоям (`controller`, `service`), а по бизнес-возможностям (`features`).

* **`features`**: Ядро приложения. Каждый пакет внутри (`user_registration`, `passwordless_auth` и т.д.) является **самодостаточным вертикальным срезом**. Он инкапсулирует всё необходимое для реализации одной бизнес-функции:
  * **API**: Контроллеры и команды (`RegisterUserCommand`).
  * **Бизнес-логика**: Обработчики (`RegisterUserHandler`).
  * **Доменная модель**: Собственные, узкоспециализированные доменные объекты (`Registrant`, `AccountWithRoles`).
  * **Порты**: Абстрактные интерфейсы, описывающие зависимости от внешнего мира (`RegistrantRepository`, `EmailService`).
  * **Исключения**: Собственные, специфичные для фичи исключения (`UserAlreadyExistsException`).
        Это обеспечивает **максимальную связанность (cohesion)** внутри среза и **минимальное зацепление (coupling)** между ними. Срез `user_registration` не имеет ни малейшего понятия о внутреннем устройстве `role_management`.

* **`infrastructure`**: "Грязный" слой, содержащий технические реализации. Он зависит от `features`, но не наоборот.
  * **Адаптеры**: Реализации портов, объявленных в `features`. Например, `infrastructure/persistence/features/user_registration/RegistrantRepositoryAdapter.java` реализует порт `features/user_registration/port/RegistrantRepository.java`, используя JPA.
  * **Внешние сервисы**: Реализации для отправки почты (`SmtpEmailService`), работы с Redis (`RedisOtpRepository`).
  * **Конфигурация безопасности**: Общая конфигурация security chain'ов (`AuthorizationServerConfig`, `DefaultSecurityConfig`), которая является платформенной и не зависит от конкретных бизнес-фич.

* **`shared`**: Этот пакет целенаправленно сделан **минималистичным**. Он содержит только действительно глобальные, кросс-функциональные компоненты, которые не могут принадлежать ни одному срезу, например, `GlobalExceptionHandler`.

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

Сервер использует асимметричное шифрование RSA для подписи JWT-токенов. Ключи должны храниться в JKS (Java KeyStore). **Этот шаг выполняется один раз для конкретной среды.**

1. Создайте директорию для хранения секретов, например `secrets/`.
2. Выполните команду для генерации файла `keystore.jks` в этой директории:

    ```bash
    keytool -genkeypair -alias jwt-signing-key -keyalg RSA -storetype JKS -keystore secrets/keystore.jks -keysize 2048 -storepass <your-strong-store-password> -keypass <your-strong-key-password>
    ```

    * **`-alias jwt-signing-key`**: Псевдоним ключа.
    * **`-keystore secrets/keystore.jks`**: Путь к файлу хранилища.
    * **`-storepass <your-strong-store-password>`**: Пароль от хранилища.
    * **`-keypass <your-strong-key-password>`**: Пароль от приватного ключа.

    **Внимание:** Эти значения **должны** совпадать со значениями в файле `.env`. Для production-среды используйте надежные, сгенерированные пароли, управляемые через секреты.

### 3.2. Конфигурация

Все параметры настраиваются через переменные окружения. Создайте файл `.env` в корне проекта, скопировав `.env.example`, и укажите необходимые значения.

### 3.3. Запуск Среды

Проект полностью контейнеризован. Запуск всех сервисов (приложение, PostgreSQL, Redis, MailHog) осуществляется одной командой из корневой директории проекта:

```bash
docker-compose up --build
```

* `--build` требуется только при первом запуске или после изменения исходного кода/Dockerfile.
* * `docker-compose.yaml` по умолчанию монтирует ваш локальный keystore `src/main/resources/keystore/keystore.jks` внутрь контейнера. Для production это поведение должно быть изменено.

После успешного запуска будут доступны следующие сервисы:

* **Authorization Server:** `http://localhost:9100`
* **PostgreSQL:** `localhost:5432`
* **Redis:** `localhost:6379`
* **MailHog (Web UI):** `http://localhost:8025`

#### 3.3.2. Запуск в Production: Безопасное управление Keystore

`Dockerfile` был обновлен для поддержки безопасного управления секретами. Теперь путь к `keystore.jks` задается через переменную окружения `KEYSTORE_PATH`.

```dockerfile
# Dockerfile
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-Dauthorization.security.keystore.path=${KEYSTORE_PATH}", "-jar", "app.jar"]
```

Это позволяет отделить артефакт сборки (JAR-файл) от секретов. В production-среде вы должны монтировать `keystore.jks` в контейнер, используя инструменты вашей платформы (например, Docker Secrets, Kubernetes Secrets, HashiCorp Vault), и передавать путь через `KEYSTORE_PATH`.

Пример для `docker-compose.yaml`, имитирующий production-подход:

```yaml
# docker-compose.yaml
services:
  auth-server:
    environment:
      - KEYSTORE_PATH=file:/etc/secrets/keystore.jks
      # ... другие переменные
    volumes:
      # СЛЕВА: путь к вашему keystore на хост-машине
      # СПРАВА: путь внутри контейнера
      - ./secrets/production.keystore.jks:/etc/secrets/keystore.jks:ro```
```

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
* **`409 Conflict`**: Пользователь с таким `email` или `nickname` уже существует.

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

### 4.3. Административные Сценарии

Эти эндпоинты предназначены для управления сервером авторизации и требуют `access_token` пользователя с ролью `ROLE_ADMIN`.

#### **Шаг 1 (для всех админ. операций): Получение токена администратора**

1. Используя email администратора (например, `admin@strollie.com`, заданный в `.env`), пройдите стандартный сценарий входа через OTP (см. секцию 4.2).
2. Полученный `access_token` будет содержать права администратора. Используйте его в заголовке `Authorization: Bearer <token>` для всех последующих запросов.

#### **Сценарий 1: Динамическая регистрация нового OAuth2 клиента**

Этот эндпоинт позволяет регистрировать новые приложения (Resource Servers, фронтенды), которые смогут использовать этот Authorization Server для аутентификации.

* **Endpoint:** `POST /api/clients`
* **Auth:** Требуется токен администратора.
* **Content-Type:** `application/json`
* **Body:**

    ```json
    {
      "clientName": "Новый Сервис Профилей",
      "grantTypes": ["authorization_code", "refresh_token", "client_credentials"],
      "redirectUris": ["http://localhost:8080/login/oauth2/code/my-client"],
      "scopes": ["openid", "profile", "user.read", "user.write"]
    }
    ```

**Пример (cURL):**

```bash
curl -X POST http://localhost:9100/api/clients \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <ТОКЕН_АДМИНИСТРАТОРА>" \
-d '{ "clientName": "Новый Сервис Профилей", "grantTypes": ["authorization_code", "refresh_token"], "redirectUris": ["http://localhost:8080/callback"], "scopes": ["openid", "profile"] }'
```

**Результат (`201 Created`):**
Сервер вернет `clientId` и `clientSecret` для нового приложения. **`clientSecret` показывается только один раз. Его необходимо немедленно скопировать и безопасно сохранить.**

```json
{
    "clientId": "сгенерированный-uuid",
    "clientSecret": "сгенерированный-безопасный-секрет"
}
```

#### **Сценарий 2: Назначение роли пользователю**

Этот эндпоинт позволяет повышать права существующих пользователей.

* **Endpoint:** `POST /api/admin/roles/assign`
* **Auth:** Требуется токен администратора.
* **Content-Type:** `application/json`
* **Body:**

    ```json
    {
      "email": "some.user@example.com",
      "role": "ROLE_ADMIN"
    }
    ```

**Пример (cURL):**

```bash
curl -X POST http://localhost:9100/api/admin/roles/assign \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <ТОКЕН_АДМИНИСТРАТОРА>" \
-d '{ "email": "some.user@example.com", "role": "ROLE_ADMIN" }'
```

**Результат (`200 OK`):**
Тело ответа пустое. Пользователю `some.user@example.com` была добавлена роль `ROLE_ADMIN`.

---

## 5. Управление Базой Данных

Схема базы данных управляется с помощью **Flyway**.

* **Расположение миграций:** `src/main/resources/db/migration`
* **Порядок применения:** Файлы выполняются в лексикографическом порядке их имен.
* **`V1`**: Создает таблицы, необходимые для Spring Authorization Server.
* **`V2`**: Создает таблицы для пользователей приложения (`users`, `user_roles`).
* **`V3`**: Создает двух начальных OAuth2-клиентов: `spa-client` и `mobile-app`.

**Внимание:** Никогда не изменяйте уже примененные миграции. Для любых изменений схемы создавайте новый файл миграции.

## 6. Нужно реализовать
- [ ] Постман для тестирования API
- [ ] Расширить интеграционные тесты
