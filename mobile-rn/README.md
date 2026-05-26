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

Инфраструктурные утилиты: кастомный HTTP-клиент поверх fetch, uuid, AsyncStorage (@react-native-async-storage) для persistence атомов.

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
2. Добавить HTTP-клиент (см. реализацию ApiClient на fetch) в `shared/api/client.ts` при необходимости.
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

---
## 14. Архитектурные проверки (FSD) и режим предупреждений

Используем `steiger` для автоматической валидации Feature-Sliced Design.

### Скрипты

| Скрипт              | Поведение                                       |
| ------------------- | ----------------------------------------------- |
| `npm run fsd:check` | Строгий режим: ненулевой код выхода при ошибках |
| `npm run fsd:warn`  | Мягкий режим: всегда 0 exit code, только вывод  |

### Husky pre-push

По умолчанию:

1. `npm run typecheck` – блокирует push при ошибках типов.
2. `npm run fsd:check` запускается, но обёрнут в `|| true`, поэтому **не блокирует** push. Это нужно, чтобы не тормозить частые итерации, пока структура активно меняется.

Чтобы вернуть строгий режим архитектуры:

1. Откройте `.husky/pre-push`.
2. Замените строку:

```sh
npm run fsd:check || true
```

на

```sh
npm run fsd:check || exit 1
```

### Частые предупреждения

| Код                      | Причина                                 | Как решать                                                    |
| ------------------------ | --------------------------------------- | ------------------------------------------------------------- |
| `insignificant-slice`    | Слайс используется единожды             | Перенести код в страницу или объединить с родственным слайсом |
| `no-public-api-sidestep` | Импорт внутренних файлов другого слайса | Экспортировать через `index.ts` публичного API                |

#### Когда уместно удалить слайс

Если feature / entity упоминается только в одном месте и не несёт потенциального переиспользования, переносим содержимое (обычно `ui/` + *минимальная логика*) прямо в `pages/<page>/`.

#### Когда оставить

Если слайс **планируется расширять** (будут новые точки использования) или он уже содержит изолированную модель / API / сложный UI.

### Кросс-сущностные зависимости

Если потребуется явная ссылка одной сущности на другую – используйте публичный API через `entities/<a>/index.ts` или (в случае сложных двусторонних связей) продуманную `@x`-нотацию (пока *не внедрено* — зарезервировано для будущего этапа).

### Рекомендации потока работы

1. Локально – писать код, запускать `npm run fsd:warn` периодически.
2. Перед PR – выполнить строгий пакет:

```bash
npm run format:check && npm run lint && npm run typecheck && npm run fsd:check
```

3. Если предупреждений много – запланировать «архитектурный cleanup» отдельным PR.
3. Если предупреждений много – запланировать «архитектурный cleanup» отдельным PR.

### Почему мягкий режим сейчас

Структура ещё эволюционирует (много «одноразовых» слайсов). Жёсткая блокировка мешала бы частым маленьким коммитам. Как только стабилизируем основные домены (`ticket`, `trip`, `profile`, `map`), можно включить строгий режим.

---

## 15. CI: производительность и стратегия native drift

## 15.0 Стратегия WebView URL (безопасное окружение)

Цель: всегда собирать production‑клиент с корректным публичным хостом WebView карты, не рискуя случайно закоммитить локальный IP / временный URL.

### Слои стратегии

1. Production источник правды: файл `.env.production` (в репозитории) содержит:

```dotenv
EXPO_PUBLIC_WEBVIEW_URL=http://91.108.246.148
```

1. Локальный override (опционально): `.env.local` (игнорируется Git) – разработчик может задать свой URL (например туннель ngrok или локальный LAN IP) **только для dev**.

1. Fallback в коде: если переменная не задана, helper берёт production fallback (тот же IP) напрямую из константы – значит даже при сломанном env сборка не «пустая».

1. Принудительная фиксация на CI: job `android-build` в `ci.yml` экспортирует `EXPO_PUBLIC_WEBVIEW_URL` через `env:` – исключает влияние случайного override в future.

### Реализация

Файл: `src/shared/lib/env/webview.ts`

Экспортируемые функции:

- `resolveWebviewUrl()` – чистое получение финального URL (без React зависимостей).
- `getWebviewUrl()` – обёртка для использования в компонентах (UI слой).

Особенности:

- Нормализует URL (гарантирует префикс `http://` / `https://`).
- Предупреждает (console.warn) в release, если обнаружен приватный / LAN IP, чтобы не уехать в прод с ошибкой.
- Private/LAN детект через regexp по диапазонам `10.*`, `192.168.*`, `172.16-31.*`, `127.*`, `::1`, локальные `.local`.

### Использование

Вместо прямого `process.env.EXPO_PUBLIC_WEBVIEW_URL`:

```ts
import { getWebviewUrl } from 'shared/lib';

const uri = getWebviewUrl();
```

Пример уже внедрён в: `pages/map/ui/map-widget/MapWidget.tsx`, `pages/map/api/mapService.ts`.

### Порядок разрешения

1. `process.env.EXPO_PUBLIC_WEBVIEW_URL` (из `.env.local` > `.env.production` > переменные среды CI).
2. Fallback константа (жёстко заданный prod IP) – как последняя защита.

### Как задать локальный URL

Создайте `.env.local`:

```dotenv
EXPO_PUBLIC_WEBVIEW_URL=http://192.168.0.54:5173
```

Перезапустите dev сервер (`npm start`). Этот файл уже в `.gitignore`, поэтому не попадёт в PR.

### Безопасность

- Production всегда закреплён: `.env.production` + CI `env:`.
- Даже если локально разработчик забудет удалить свой override → на CI он не сработает.
- Есть runtime предупреждение если приватный IP попал в release build.

### Добавление новых публичных URL

Для аналогичных кейсов повторяйте паттерн: файл helper `shared/lib/env/<name>.ts` + commit `.env.production` + CI override. Избегайте чтения env напрямую внутри глубинных компонентов.

---

CI workflow (`.github/workflows/ci.yml`) оптимизирован под быстрые итерации мобильного приложения:

### 15.1 Commit‑Stable Android Skeleton

Директория `android/` закоммичена в репозиторий, чтобы:

- Исключить дорогостоящий `expo prebuild` на каждом прогоне.
- Сделать нативный слой детерминированным и кодо‑ревьюабельным.

### 15.2 Advisory Native Drift Check

Шаг `native-drift` запускается только если изменены файлы из группы `native_impact` (app.json, app.config.*, плагины, expo-env, некоторые assets). Скрипт `scripts/native-drift-check.sh`:

1. Создаёт временную копию проекта (исключая build артефакты, `.gradle`, intermediates).
2. Выполняет `npx expo prebuild --platform android --no-install`.
3. Делает фильтрованный `diff -ru` с текущей `android/` (игнор служебных директорий).
4. Печатает `NO_DRIFT` или `DRIFT_DETECTED` (не ломает сборку, пока режим advisory).

Если зафиксирован `DRIFT_DETECTED` — нужно локально повторить `expo prebuild`, проанализировать различия и при необходимости закоммитить обновлённый нативный слой (отдельным осознанным PR).

### 15.3 Текущие оптимизации

- Gradle параллелизм: `org.gradle.parallel=true`, лимит воркеров (`org.gradle.workers.max=4`) для предсказуемости в CI.
- ESLint / Prettier caching: директории `.cache/eslint` и `.cache/prettier` кэшируются через `actions/cache`.
- Условная сборка Android: пропускается при отсутствии изменений в `android` и `native_impact`.
- Линтер архитектуры (steiger) и drift check работают в advisory режиме (не блокируют быстрые фиче‑циклы).

### 15.4 Возможные будущие улучшения

- Удалённый Gradle build cache (shared cache server) / расширенная конфигурация.
- Конфигурационный cache Gradle с устойчивым volume (приемлемо, когда структура стабилизируется).
- Сжатие артефактов для последующих джоб (например распределение AAB / mapping.txt).
- Прогрессивное ужесточение `--max-warnings` ESLint до 0 и снятие `continue-on-error`.
- Отдельный workflow для подписанной релизной сборки (AAB) + подпись.

### 15.5 Когда обновлять `android/`

Обновляйте нативный слой только если:

- Drift check показал значимые изменения (новые плагины, обновлённые Gradle файлы, изменения AndroidManifest, ресурсы).
- Вручную выполнен `expo prebuild` после обновления SDK/плагина.
- Требуется добавить/изменить нативный permission, service, intent‑filter.

Не стоит коммитить временные изменения/авто‑мусор (intermediates, build, `.gradle` каталоги) — они отфильтрованы `.gitignore` и drift‑скриптом.

### 15.6 Локальная проверка drift

```bash
./scripts/native-drift-check.sh
```

Если вывод `DRIFT_DETECTED` — изучите `diff` и примите решение о синхронизации.

---
