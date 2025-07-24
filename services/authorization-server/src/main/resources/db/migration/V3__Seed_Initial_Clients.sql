-- Добавляем OAuth2 клиента для SPA приложения
-- SPA клиент для авторизации через код авторизации (стандартный OAuth2 flow)
INSERT INTO oauth2_registered_client
(
    id,
    client_id,
    client_id_issued_at,
    client_secret,
    client_secret_expires_at,
    client_name,
    client_authentication_methods,
    authorization_grant_types,
    redirect_uris,
    post_logout_redirect_uris,
    scopes,
    client_settings,
    token_settings
)
VALUES
    (
        '9f4f3c8c-3dd7-4a45-b5e0-a09c6d1f8432', -- id
        'spa-client', -- client_id
        CURRENT_TIMESTAMP, -- client_id_issued_at
        '{bcrypt}$2y$05$2U0uo1NMXafQowLQbWd9hOM8wqP6N.74zDGzLNVEg2XS4.D7dOYCy', -- client_secret (encoded 'secret')
        NULL, -- client_secret_expires_at
        'SPA Client', -- client_name
        'client_secret_basic', -- client_authentication_methods
        'authorization_code,refresh_token', -- authorization_grant_types
        'myapp://callback,http://127.0.0.1:4200/authorized', -- redirect_uris
        NULL, -- post_logout_redirect_uris
        'openid,profile,message.read', -- scopes
        '{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":true,"settings.client.require-authorization-consent":false}', -- client_settings
        '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.reuse-refresh-tokens":false,"settings.token.id-token-signature-algorithm":"RS256","settings.token.access-token-time-to-live":["java.time.Duration",3600],"settings.token.refresh-token-time-to-live":["java.time.Duration",86400]}' -- token_settings
    )
    ON CONFLICT (id) DO NOTHING;

-- Мобильный клиент для OTP аутентификации (кастомный grant type)
INSERT INTO oauth2_registered_client
(
    id,
    client_id,
    client_id_issued_at,
    client_secret,
    client_secret_expires_at,
    client_name,
    client_authentication_methods,
    authorization_grant_types,
    redirect_uris,
    post_logout_redirect_uris,
    scopes,
    client_settings,
    token_settings
)
VALUES
    (
        'dd95cdc6-3a0f-4c75-b271-8d53c6e45d7a', -- id
        'mobile-app', -- client_id
        CURRENT_TIMESTAMP, -- client_id_issued_at
        '{bcrypt}$2y$05$2U0uo1NMXafQowLQbWd9hOM8wqP6N.74zDGzLNVEg2XS4.D7dOYCy', -- client_secret (encoded 'secret')
        NULL, -- client_secret_expires_at
        'Mobile Application', -- client_name
        'client_secret_basic', -- client_authentication_methods
        'urn:ietf:params:oauth:grant-type:otp,refresh_token',
        NULL, -- redirect_uris
        NULL, -- post_logout_redirect_uris
        'openid,profile,message.read', -- scopes
        '{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":false,"settings.client.require-authorization-consent":false}', -- client_settings
        '{"@class":"java.util.Collections$UnmodifiableMap","settings.token.reuse-refresh-tokens":false,"settings.token.id-token-signature-algorithm":"RS256","settings.token.access-token-time-to-live":["java.time.Duration",3600],"settings.token.refresh-token-time-to-live":["java.time.Duration",86400]}' -- ИСПРАВЛЕНО: Ротация refresh-токенов включена (reuse=false)
    )
    ON CONFLICT (id) DO NOTHING;