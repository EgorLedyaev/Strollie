# Analytics service

Единая точка отправки событий приложения. Основные принципы:

- **Транспорты** инкапсулируют интеграцию с конкретным провайдером (AppMetrica, PostHog, Amplitude и т.д.).
- **Типобезопасность** достигается за счёт карты событий `AnalyticsEventMap`. Новые события добавляются через declaration merging в любом слайсе.
- **Контекст** (версия приложения, платформа, пользователь и т.д.) автоматически пробрасывается во все транспорты.

## Добавление события

```ts
declare global {
    interface StrollieAnalyticsEventMap {
        'trip.builder.started': {
            tripType: 'solo' | 'group';
            source: 'cta' | 'floating-button';
        };
    }
}
```

После объявления можно вызывать `analytics.trackEvent('trip.builder.started', { ... })` с подсказками типов.

## Добавление транспорта

Создайте файл в `shared/lib/analytics/transports` и реализуйте интерфейс `AnalyticsTransport`. Зарегистрируйте транспорт при старте приложения с помощью `analytics.registerTransport(...)`.
