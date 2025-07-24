package ru.riveo.strollie.authorization_server.features.user_registration;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.features.user_registration.domain.Registrant;
import ru.riveo.strollie.authorization_server.features.user_registration.exception.UserAlreadyExistsException;
import ru.riveo.strollie.authorization_server.features.user_registration.port.RegistrantRepository;

@Service
@RequiredArgsConstructor
public class RegisterUserHandler {

    private final RegistrantRepository registrantRepository;

    public void handle(RegisterUserCommand command) {
        if (registrantRepository.existsByEmailOrNickname(command.email(), command.nickname())) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        var registrant = Registrant.from(
                command.email(),
                command.nickname(),
                command.firstName(),
                command.lastName(),
                command.city(),
                command.dateOfBirth());

        registrantRepository.save(registrant);
    }
}
