package ru.riveo.strollie.authorization_server.features.role_management;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.features.role_management.domain.AccountWithRoles;
import ru.riveo.strollie.authorization_server.features.role_management.exception.UserNotFoundException;
import ru.riveo.strollie.authorization_server.features.role_management.port.AccountRepository;

@Service
@RequiredArgsConstructor
public class AssignRoleHandler {

    private final AccountRepository accountRepository;

    public void handle(AssignRoleCommand command) {
        AccountWithRoles account = accountRepository.findByEmail(command.email())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + command.email()));

        account.assignRole(command.role());

        accountRepository.save(account);
    }
}
