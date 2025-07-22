package ru.riveo.strollie.authorization_server.features.user_registration;

import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.shared.domain.User;
import ru.riveo.strollie.authorization_server.shared.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class RegisterUserHandler {

    private final UserRepository userRepository;

    @Transactional
    public void handle(RegisterUserCommand command) {
        if (userRepository.existsByEmail(command.email())) {
            throw new IllegalStateException("User with this email already exists");
        }
        if (userRepository.existsByNickname(command.nickname())) {
            throw new IllegalStateException("User with this nickname already exists");
        }

        User newUser = new User(
                null,
                command.email(),
                command.nickname(),
                command.firstName(),
                command.lastName(),
                command.city(),
                command.dateOfBirth(),
                Set.of("ROLE_USER"),
                true,
                true,
                true,
                true);

        userRepository.save(newUser);
    }
}
