package ru.riveo.strollie.authorization_server.features.user_registration;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.riveo.strollie.authorization_server.features.user_registration.domain.Registrant;
import ru.riveo.strollie.authorization_server.infrastructure.persistence.jpa.UserEntity;

@Mapper(componentModel = "spring")
public interface RegistrantMapper {
    /**
     * Преобразует доменную модель registrant в JPA-сущность.
     */
    @Mapping(target = "id", ignore = true) // id генерируется базой
    @Mapping(target = "roles", ignore = true) // роли устанавливаются в адаптере
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "accountNonExpired", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    @Mapping(target = "credentialsNonExpired", ignore = true)
    @Mapping(target = "version", ignore = true)
    UserEntity toEntity(Registrant registrant);
}
