package ru.riveo.strollie.authorization_server.features.role_management;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.shared.domain.User;
import ru.riveo.strollie.authorization_server.shared.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AssignRoleHandler {

    private final UserRepository userRepository;

    @Transactional
    public void handle(AssignRoleCommand command) {
        User user = userRepository.findByEmail(command.email())
                .orElseThrow(() -> new IllegalStateException("User not found with email: " + command.email()));

        // Создаем изменяемую копию ролей
        Set<String> updatedRoles = new HashSet<>(user.roles());

        // Добавляем новую роль, предварительно убедившись, что она в правильном формате
        String roleToAdd = command.role().startsWith("ROLE_") ? command.role() : "ROLE_" + command.role();
        updatedRoles.add(roleToAdd.toUpperCase());

        // Создаем обновленный объект User
        User updatedUser = new User(
                user.id(),
                user.email(),
                user.nickname(),
                user.firstName(),
                user.lastName(),
                user.city(),
                user.dateOfBirth(),
                updatedRoles, // Передаем обновленный сет ролей
                user.enabled(),
                user.accountNonExpired(),
                user.accountNonLocked(),
                user.credentialsNonExpired());

        userRepository.save(updatedUser);
    }
}
