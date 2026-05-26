package ru.riveo.strollie.authorization_server.features.role_management.domain;

import jakarta.validation.constraints.NotBlank;

import java.util.*;

public class AccountWithRoles {
    private final UUID id;
    private final Set<String> roles;

    private AccountWithRoles(UUID id, Set<String> roles) {
        this.id = Objects.requireNonNull(id);
        this.roles = Objects.requireNonNull(roles);
    }


    /**
     * Фабричный метод для создания из состояния (БД).
     *
     * @param id    Уникальный идентификатор аккаунта.
     * @param roles Набор ролей, назначенных пользователю.
     * @return Новый экземпляр AccountWithRoles.
     */
    public static AccountWithRoles fromState(UUID id, Set<String> roles) {
        return new AccountWithRoles(id, new HashSet<>(roles)); // Создаем изменяемую копию для внутреннего состояния
    }

    /**
     * Назначает пользователю новую роль.
     *
     * @param role Назначаемая роль.
     */
    public void assignRole(@NotBlank String role) {
        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role cannot be null or blank");
        }
        String roleToAdd = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        this.roles.add(roleToAdd.toUpperCase());
    }

    /**
     * Снимает роль с пользователя.
     *
     * @param role Снимаемая роль.
     */
    public void removeRole(String role) {
        if (role == null || role.isBlank()) {
            return; // Игнорируем невалидные значения
        }
        String roleToRemove = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        this.roles.remove(roleToRemove.toUpperCase());
    }

    // --- ГЕТТЕРЫ ---
    public UUID getId() {
        return id;
    }

    public Set<String> getRoles() {
        return Collections.unmodifiableSet(roles);
    }
}
