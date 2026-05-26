package ru.riveo.strollie.authorization_server.features.role_management;

import org.mapstruct.*;
import ru.riveo.strollie.authorization_server.features.role_management.domain.AccountWithRoles;
import ru.riveo.strollie.authorization_server.infrastructure.persistence.jpa.UserEntity;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    // --- Мапперы для role_management ---

    /**
     * Создает доменный объект AccountWithRoles из UserEntity.
     * Использует статический фабричный метод fromState.
     */
    default AccountWithRoles toAccountWithRoles(UserEntity entity) {
        if (entity == null) {
            return null;
        }
        return AccountWithRoles.fromState(entity.getId(), entity.getRoles());
    }

    /**
     * Обновляет UserEntity данными из AccountWithRoles.
     * MapStruct автоматически обновит поле `roles`.
     * @param account Доменный объект с новыми данными.
     * @param entity Существующая JPA-сущность для обновления.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, ignoreByDefault = true)
    @Mapping(target = "roles", source = "roles") // Явно указываем, что мапить roles -> roles
    void updateEntityFromAccountWithRoles(AccountWithRoles account, @MappingTarget UserEntity entity);
}
