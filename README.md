# Strollie — Monorepo

Монорепозиторий проекта Strollie. Объединяет мобильные клиенты и все бэкенд-сервисы.

## Структура

```
├── mobile/                          # Flutter-приложение
├── mobile-rn/                       # React Native / Expo приложение
└── services/
    ├── authorization-server/        # OAuth2 сервер авторизации (Spring Boot)
    ├── route-service/               # Сервис маршрутов (Spring Boot)
    ├── strollie-back/               # API Gateway + auth service (Spring Boot)
    ├── social-network/              # Социальная сеть — инфраструктура и сервисы
    ├── social-network-strollie/     # Мессенджер + клиент социальной сети
    └── social-network-strollie-v2/  # Auth, Messenger, PersonalCabinet (Spring Boot)
```

## Сервисы

| Сервис | Стек | Описание |
|--------|------|----------|
| `mobile` | Flutter / Dart | Мобильный клиент (Flutter) |
| `mobile-rn` | React Native / Expo / TypeScript | Мобильный клиент (React Native) |
| `authorization-server` | Spring Boot, Gradle | OAuth2 сервер авторизации |
| `route-service` | Spring Boot, Gradle | Микросервис управления маршрутами |
| `strollie-back` | Spring Boot, Gradle | API Gateway + сервис аутентификации |
| `social-network` | — | Социальная сеть: инфраструктура, сервисы |
| `social-network-strollie` | — | Мессенджер и клиент социальной сети |
| `social-network-strollie-v2` | Spring Boot | Auth, Messenger, PersonalCabinet |

## Запуск

Каждый сервис запускается независимо из своей директории. Docker Compose файлы находятся в папках соответствующих сервисов.

### Flutter

```bash
cd mobile
flutter pub get
flutter run
```

### React Native

```bash
cd mobile-rn
npm install
npm start
```

### Spring Boot сервисы

```bash
cd services/<service-name>
./gradlew bootRun
```

### Docker

```bash
cd services/<service-name>
docker compose up
```
