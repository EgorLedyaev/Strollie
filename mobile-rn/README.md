# Strollie

Мобильное приложение (React Native + Expo Router) для управления билетами и поездками: хранение и просмотр билетов (кино, поезд, самолёт), создание поездок с чек‑листами, маршрутами, заметками и привязкой билетов.

Документ предназначен для разработчиков команды и описывает: архитектуру, практики, модели данных, запуск, тестирование и расширение.

---
## 1. Технологический стек

Основное:

- React Native 0.79 / React 19
- Expo SDK 53 (expo-router для навигации)
- TypeScript 5
- Jotai для состояния (с минимализмом и атомами хранения)
- Jest + @testing-library/react-native для тестов
- ESLint + Prettier + steiger (feature-sliced архитектурный линтер)
- react-native-reanimated, gesture-handler, safe-area, svg

Инфраструктурные утилиты: axios (HTTP), uuid, AsyncStorage (@react-native-async-storage) для persistence атомов.

---

## 2. Архитектура и структура каталогов

Используем адаптацию Feature-Sliced Design (FSD) под мобильное приложение.

Высокоуровневые слои (грубо сверху вниз):

1. `app/` – настройки маршрутизации (expo-router), провайдеры контекстов, входные точки экранов.
2. `pages/` – композиции экрана (склеивают widgets/features/entities, минимальная логика orchestration).
3. `widgets/` – крупные UI-блоки, объединяющие несколько features/entities (например навбар, списки билетов).
4. `features/` – прикладные пользовательские действия (например: показать QR билета, детали билета, авторизация по email).
5. `entities` – доменные сущности (ticket, trip, user, session, city и т.п.). Содержат модели, api, state, ui карточек.
6. `shared/` – переиспользуемые утилиты, токены дизайна, базовые UI-компоненты, инфраструктурные сервисы.

Правило зависимостей: верхние слои могут тянуть нижние. Нижние не знают про верхние. `shared` не импортирует из других слоёв. `entities` не импортируют `features`, `pages` и т.д.

### 2.1. Пример структуры сущности

```text
entities/ticket/
	api/        – mock / адаптеры
	model/      – типы, atoms состояния
	ui/         – карточки, компоненты отображения
	index.ts    – публичный бандл экспортов
```

### 2.2. Добавление новой сущности

1. Создать папку `entities/<name>/` с подпапками `model`, при необходимости `api`, `ui`.
2. В `model` определить интерфейсы и атомы.
3. В `api` – адаптер (mock сейчас, позже HTTP). Экспортировать чистые функции (не React hooks).
4. В `ui` – dumb-компоненты.
5. В `index.ts` собрать публичный API сущности.

### 2.3. Страница (`pages/`)

Страница агрегирует:

- Подписку на атомы/запросы
- Передачу данных в widgets/features
- Локальный UI layout

Бизнес-логика (изменение состояния) должна жить в features/entities, а не в `pages`.

---

## 3. Навигация

Используем `expo-router`. Структура `src/app` определяет маршруты.

- `app/index.tsx` – корневой экран (например дашборд/список).
- Подпапки (например `app/(app)/tickets/index.tsx`) группируют стек.
- Динамические маршруты: `[id].tsx`.

Если экран требует провайдеры контекста – подключаются в `_layout.tsx` соответствующей папки.

---

## 4. Состояние (Jotai)

Принципы:

- Атомы для минимальных единиц (сессия, профиль, выбор билета, форма создания поездки).
- Композиция через производные атомы там, где нужно вычислимое значение.
- Persistence: атомы могут использовать `atomWithStorage` (AsyncStorage) – пример есть в session/profile (см. `session.state.ts`).
- Сброс при логауте: отдельный reset-атом, вызываемый в `logoutAtom` (чтобы исключить протечки данных пользователя).

Рекомендация: не помещать в атомы временные UI-состояния внутри чисто локальных компонент (там достаточно `useState`).

---

## 5. Модели данных (часть)

### Ticket (упрощённо)

```ts
interface Ticket {
	id: string;
	from: string;        // город / кинотеатр
	to: string;          // пункт назначения / фильм
	departureTime?: string; // ISO
	arrivalTime?: string;   // ISO
	carrierInfo?: { name: string; flight?: string };
	qrCodeUrl: string;
	type: 'plane' | 'train' | 'other'; // cinema пока 'other'
	isUsed: boolean;
	hall?: string; row?: string; seat?: string; address?: string;
}
```

### Trip

```ts
interface TripChecklistItem { id: string; text: string; done: boolean; }
interface Trip {
	id: string;
	title?: string;
	startDate: string; // ISO
	endDate: string;   // ISO
	ticketIds: string[];
	places: string[];
	routes: string[];
	checklist: TripChecklistItem[];
	notes?: string;
	createdAt: string;
	updatedAt: string;
}
```

---
 
## 6. Mock API слой

Файлы: `entities/*/api/*Api.ts`.

Сейчас это in-memory моки / задержки через `sleep`. При замене на бэкенд:

1. Сохранить сигнатуры экспортируемых методов.
2. Добавить HTTP-клиент (axios уже установлен) в `shared/api/client.ts` при необходимости.
3. Интерфейсы типов не менять без ревью (повлияет на UI и состояние).

Пример: `ticketApi.getMyTickets()` возвращает массив билетов с уже готовым `qrCodeUrl` (используется публичный сервис генерации QR). `tripApi.createTrip` возвращает созданную сущность и пушит в локальный массив.

---
 
## 7. UI и дизайн

- Общие токены: `shared/tokens.ts` (цвета, шрифты, радиусы).
- Базовые компоненты: `shared/ui/*` (кнопки, текст, инпуты, диалоги, селекты и т.д.). Не использовать напрямую примитивы RN (например `TextInput`) там, где есть обёртки – ради единообразия и темизации.
- Иконки и изображения: `assets/icons`, `assets/images`, кастомные SVG – через `react-native-svg`.
- Шрифты Suisse Intl подключены в assets/fonts.

### Диалоги / модалки

Используем унифицированный Dialog (см. `shared/ui/Dialog`). TicketDetailsDialog – пример сложной модалки с условной компоновкой.

### Селект

Упрощён, без избыточных порталов. Авторазмещение (вверх/вниз) по свободному пространству.

---
 
## 8. Скрипты (package.json)

| Скрипт                  | Назначение                                         |
| ----------------------- | -------------------------------------------------- |
| `npm start`             | Dev сервер Expo (метро)                            |
| `npm run clear`         | Dev сервер с очисткой кеша                         |
| `npm run android`       | Сборка/запуск на Android (run:android)             |
| `npm run ios`           | Сборка/запуск на iOS (при наличии окружения)       |
| `npm run web`           | Запуск web-target через Expo                       |
| `npm test`              | Jest watchAll тесты                                |
| `npm run lint`          | ESLint (через expo lint)                           |
| `npm run reset-project` | Скрипт локального сброса (очистка/реинициализация) |

### Дополнительно

Архитектурная проверка:

```bash
npx steiger ./src
```

---
 
## 9. Запуск и окружение

### Предпосылки

- Node.js LTS (>=18)
- npm >= 9 (или pnpm/yarn – но репозиторий сейчас ориентирован на npm)
- Android SDK / Xcode (для нативных сборок)

### Быстрый старт

```bash
npm install
npm start
```

### Android (debug)

```bash
npx expo run:android --device
```

### Android (release сборка)

```bash
npx expo run:android --variant release
```

### iOS (macOS)

```bash
npx expo run:ios
```

### Очистка кэша (при странных ошибках bundler)

```bash
npm run clear
```

### Переменные окружения (.env)

Expo (SDK 53) использует префикс `EXPO_PUBLIC_` для переменных, доступных на клиенте. Все значения без этого префикса не попадут в бандл. Для локальной разработки можно создать файл `.env` (добавьте в `.gitignore` приватные ключи; публичные ключи API, которые неизбежно раскрываются в клиенте, допускается коммитить, но предпочтительно подставлять через CI/CD).

Пример `.env`:

```dotenv
# Публичный ключ 2GIS для геокодирования (обязателен для запуска функций геокодера)
EXPO_PUBLIC_2GIS_API_KEY=your_2gis_key_here

# URL / хост сервиса построения маршрутов (Valhalla gateway или bff). Может быть домен или host:port
EXPO_PUBLIC_ROUTE_API=routes.internal.local:8080

# Флаги моков загрузки аватара
EXPO_PUBLIC_USE_MOCK_UPLOAD_AVATAR=true
# local | cdn – режим возврата мокового URL
EXPO_PUBLIC_MOCK_UPLOAD_AVATAR_MODE=local
# База CDN для режима cdn
EXPO_PUBLIC_MOCK_CDN_BASE=https://cdn.strollie.ru/avatars

# URL webview карты (если используется внешний хост)
EXPO_PUBLIC_WEBVIEW_URL=https://maps.strollie.ru/app
```

Где используется:

- `EXPO_PUBLIC_2GIS_API_KEY`: `shared/config/api.ts` – выбрасывает ошибку при отсутствии.
- `EXPO_PUBLIC_ROUTE_API`: `shared/api/routeService.ts` – построение маршрута.
- `EXPO_PUBLIC_WEBVIEW_URL`: `pages/map/*` для внедрения WebView.
- `EXPO_PUBLIC_USE_MOCK_UPLOAD_AVATAR`, `EXPO_PUBLIC_MOCK_UPLOAD_AVATAR_MODE`, `EXPO_PUBLIC_MOCK_CDN_BASE`: `shared/config/feature-flags.ts` – управление стратегией моков загрузки.

Рекомендации по секретам:

1. Никогда не кладите приватные backend токены без `EXPO_PUBLIC_` (они не попадут в бандл и должны обрабатываться на сервере).  
2. Для truly secret ключей (например, write-токены) — используйте серверный прокси.  
3. Проверяйте, что все публичные ключи имеют ограниченные права в консоли провайдера.  
4. В CI можно генерировать `.env` из секретов (GitHub Actions → шаг echo >> .env).

Подстановка в рантайме: Expo автоматически инлайнит эти переменные в `process.env.*` при сборке. При изменении `.env` перезапустите dev-сервер (`npm start` или `npm run clear`).

Сканировать QR (Expo Go / Dev Client) либо запустить эмулятор.

### Android (debug)
```bash
npx expo run:android --device
```

### Android (release сборка)
```bash
npx expo run:android --variant release
```

### iOS (macOS)
```bash
npx expo run:ios
```

### Очистка кэша (при странных ошибках bundler)
```bash
npm run clear
```

---
## 10. Тестирование

Используем Jest + `@testing-library/react-native`.

Пример запуска:

```bash
npm test
```

Добавляйте тесты ближе к слою логики (например в `entities/<entity>/model/__tests__`). UI-снимки – опционально, но избегайте излишней хрупкости (снапшоты обновлять осознанно).
Используем Jest + `@testing-library/react-native`.

Пример запуска:
```bash
npm test
```
Добавляйте тесты ближе к слою логики (например в `entities/<entity>/model/__tests__`). UI-снимки – опционально, но избегайте излишней хрупкости (снапшоты обновлять осознанно).

---
## 11. Качество кода и линтинг

Запуск:

```bash
npm run lint
npx steiger ./src
```

Prettier конфигурация + сортировка импортов (plugin sort-imports). Следите за порядком: внешние пакеты → алиасы → относительные пути.
Запуск:
```bash
npm run lint
npx steiger ./src
```
Prettier конфигурация + сортировка импортов (plugin sort-imports). Следите за порядком: внешние пакеты → алиасы → относительные пути.

### Conventions

- Имена атомов: `<name>Atom`.

- Файлы состояния: `<domain>.state.ts` или `state.ts` внутри slice.

- Интерфейсы сущностей: PascalCase, без суффикса `Interface`.

- Паблик экспорт слоя в `index.ts` (re-export) – для удобного импортирования сверху.

- Не импортировать напрямую файлы глубоко из соседних слоёв – только через публичный индекс.
- Имена атомов: `<name>Atom`.
- Файлы состояния: `<domain>.state.ts` или `state.ts` внутри slice.
- Интерфейсы сущностей: PascalCase, без суффикса `Interface`.
- Паблик экспорт слоя в `index.ts` (re-export) – для удобного импортирования сверху.
- Не импортировать напрямую файлы глубоко из соседних слоёв – только через публичный индекс.

---
## 12. Создание новой фичи (пример)
Цель: добавить функцию «Отметить билет использованным».
1. Создать `features/mark-ticket-used/`.
2. В `model/` – атом/экшен (или использовать action-атом внутри ticket entity если уместно).
3. В `ui/` – кнопка/иконка, принимающая `ticketId` и дергающая экшен.
4. Добавить публичный `index.ts`.
5. Подключить в карточке билета (слой `entities/ticket/ui/...`) или в виджете списка.
6. Написать тест на экшен (меняет поле isUsed у нужного билета).

---
## 13. Краткая шпаргалка команд
```bash
npm install               # установка зависимостей
npm start                 # dev режим, Metro
npm run android           # сборка/запуск на Android
npm run ios               # сборка/запуск на iOS
npm test                  # тесты
npm run lint              # линтер
npx steiger ./src         # архитектурная проверка
npm run clear             # очистка кеша Metro
```
