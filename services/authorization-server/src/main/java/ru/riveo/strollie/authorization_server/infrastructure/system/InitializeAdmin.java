package ru.riveo.strollie.authorization_server.infrastructure.system;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import ru.riveo.strollie.authorization_server.features.role_management.domain.AccountWithRoles;
import ru.riveo.strollie.authorization_server.features.role_management.port.AccountRepository;
import ru.riveo.strollie.authorization_server.features.user_registration.domain.Registrant;
import ru.riveo.strollie.authorization_server.features.user_registration.port.RegistrantRepository;

@Component
@Profile("!test") // Инициализация администратора не должна выполняться в тестах
@RequiredArgsConstructor
@Slf4j
public class InitializeAdmin implements ApplicationRunner {

    private final RegistrantRepository registrantRepository;
    private final AccountRepository accountRepository;
    private final AdminProperties adminProperties;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        String adminEmail = adminProperties.email();
        String adminNickname = adminProperties.nickname();
        if (!registrantRepository.existsByEmailOrNickname(adminEmail, adminNickname)) {
            log.info("Admin user not found. Creating a new one with email: {}", adminEmail);

            // Шаг 1: Используем фичу регистрации
            var registrant = Registrant.from(
                    adminEmail,
                    adminNickname,
                    "Admin",
                    "Strollie",
                    "System",
                    java.time.LocalDate.now());
            registrantRepository.save(registrant);

            // Шаг 2: Используем фичу управления ролями
            AccountWithRoles adminAccount = accountRepository.findByEmail(adminEmail)
                            .orElseThrow(() -> new IllegalStateException("Failed to find newly created admin"));


            adminAccount.assignRole("ROLE_ADMIN");
            accountRepository.save(adminAccount);
            log.info("Admin user {} created successfully.", adminEmail);
        } else {
            log.info("Admin user with email {} already exists. Skipping creation.", adminEmail);
        }
    }
}
