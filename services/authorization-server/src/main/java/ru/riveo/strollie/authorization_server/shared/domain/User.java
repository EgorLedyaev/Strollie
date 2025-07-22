package ru.riveo.strollie.authorization_server.shared.domain;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record User(
        UUID id,
        String email,
        String nickname,
        String firstName,
        String lastName,
        String city,
        LocalDate dateOfBirth,
        Set<String> roles,
        boolean enabled,
        boolean accountNonExpired,
        boolean accountNonLocked,
        boolean credentialsNonExpired) {
    public static User create(String email) {
        return new User(
                null,
                email,
                email, // nickname = email по умолчанию
                "", // firstName
                "", // lastName
                "", // city
                LocalDate.now(), // dateOfBirth - подставляем текущую дату, хотя это невалидно
                Set.of("ROLE_USER"),
                true,
                true,
                true,
                true);
    }
}
