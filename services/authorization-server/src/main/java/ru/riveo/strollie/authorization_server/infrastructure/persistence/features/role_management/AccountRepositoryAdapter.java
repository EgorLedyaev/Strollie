package ru.riveo.strollie.authorization_server.infrastructure.persistence.features.role_management;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.riveo.strollie.authorization_server.features.role_management.AccountMapper;
import ru.riveo.strollie.authorization_server.features.role_management.domain.AccountWithRoles;
import ru.riveo.strollie.authorization_server.features.role_management.port.AccountRepository;
import ru.riveo.strollie.authorization_server.infrastructure.persistence.jpa.JpaUserRepository;
import ru.riveo.strollie.authorization_server.infrastructure.persistence.jpa.UserEntity;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AccountRepositoryAdapter implements AccountRepository {

    private final JpaUserRepository jpaUserRepository;
    private final AccountMapper accountMapper;

    @Override
    @Transactional(readOnly = true) // Явно указываем, что это операция чтения.
    public Optional<AccountWithRoles> findByEmail(String email) {
        Optional<UserEntity> userEntityOptional = jpaUserRepository.findByEmail(email);
        return userEntityOptional.map(accountMapper::toAccountWithRoles);
    }

    @Override
    @Transactional // Операция записи.
    public void save(AccountWithRoles account) {
        UUID userId = account.getId();

        // Мы не можем просто сохранить `AccountWithRoles`, так как в таблице users есть другие поля.
        // Нам нужно обновить существующую запись.
        UserEntity userEntity = jpaUserRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Attempted to save roles for a non-existent user with ID: " + userId));

        accountMapper.updateEntityFromAccountWithRoles(account, userEntity);

        jpaUserRepository.save(userEntity);
    }
}