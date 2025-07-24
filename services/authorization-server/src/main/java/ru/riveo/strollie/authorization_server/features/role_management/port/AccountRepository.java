package ru.riveo.strollie.authorization_server.features.role_management.port;

import ru.riveo.strollie.authorization_server.features.role_management.domain.AccountWithRoles;
import java.util.Optional;

public interface AccountRepository {

    Optional<AccountWithRoles> findByEmail(String email);

    void save(AccountWithRoles account);
}