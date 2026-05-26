package ru.riveo.strollie.authorization_server.features.client_management.register_client;

// Этот объект возвращает сгенерированные креды.
// Секрет должен быть показан ТОЛЬКО ОДИН РАЗ.
public record RegisterClientResponse(
        String clientId,
        String clientSecret) {
}
