package ru.riveo.strollie.authorization_server.features.user_registration.domain;

import lombok.Getter;

import java.time.LocalDate;
import java.util.Objects;

// Этот класс знает ТОЛЬКО о том, как создать нового пользователя.
// Он не имеет методов для смены ролей, аутентификации и т.д.
@Getter
public final class Registrant {

    private final String email;
    private final String nickname;
    private final String firstName;
    private final String lastName;
    private final String city;
    private final LocalDate dateOfBirth;

    // Приватный конструктор.
    private Registrant(String email, String nickname, String firstName, String lastName, String city, LocalDate dateOfBirth) {
        // Здесь инварианты, специфичные для регистрации.
        this.email = Objects.requireNonNull(email);
        this.nickname = Objects.requireNonNull(nickname);
        this.firstName = Objects.requireNonNull(firstName);
        this.lastName = Objects.requireNonNull(lastName);
        this.city = Objects.requireNonNull(city);
        this.dateOfBirth = Objects.requireNonNull(dateOfBirth);
    }

    /**
     * Фабричный метод для создания нового регистрационного объекта.
     * Используется в обработчике регистрации пользователя.
     *
     * @param email Email пользователя.
     * @param nickname Никнейм пользователя.
     * @param firstName Имя пользователя.
     * @param lastName Фамилия пользователя.
     * @param city Город пользователя.
     * @param dateOfBirth Дата рождения пользователя.
     * @return Новый объект Registrant.
     */
    public static Registrant from(String email, String nickname, String firstName, String lastName, String city, LocalDate dateOfBirth) {
        return new Registrant(email, nickname, firstName, lastName, city, dateOfBirth);
    }

}