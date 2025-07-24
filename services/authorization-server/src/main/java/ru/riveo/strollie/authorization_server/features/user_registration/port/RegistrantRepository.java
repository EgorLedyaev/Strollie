package ru.riveo.strollie.authorization_server.features.user_registration.port;


import ru.riveo.strollie.authorization_server.features.user_registration.domain.Registrant;

public interface RegistrantRepository {
    /**
     * Проверяет, существует ли пользователь с таким email или nickname.
     * @param email Email для проверки.
     * @param nickname Nickname для проверки.
     * @return true, если пользователь существует, иначе false.
     */
    boolean existsByEmailOrNickname(String email, String nickname);

    /**
     * Сохраняет данные нового пользователя.
     * @param registrant DTO с данными нового пользователя.
     */
    void save(Registrant registrant);
}