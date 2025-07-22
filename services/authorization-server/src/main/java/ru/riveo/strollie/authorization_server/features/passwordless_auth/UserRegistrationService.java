package ru.riveo.strollie.authorization_server.features.passwordless_auth;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ru.riveo.strollie.authorization_server.shared.domain.User;
import ru.riveo.strollie.authorization_server.shared.repository.UserRepository;
import ru.riveo.strollie.authorization_server.shared.security.UserDetailsServiceImpl;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final UserDetailsServiceImpl userDetailsService;

    /**
     * Находит пользователя по email. Используется для входа.
     * Не создает нового пользователя, если пользователь не найден.
     * 
     * @param email Email пользователя
     * @return UserDetails существующего пользователя
     * @throws BadCredentialsException если пользователь не найден
     */
    public UserDetails findExistingUser(String email) {
        try {
            return userDetailsService.loadUserByUsername(email);
        } catch (UsernameNotFoundException e) {
            log.warn("Authentication attempt for non-existent user: {}", email);
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    /**
     * Регистрирует нового пользователя.
     * Этот метод должен использоваться только для явной регистрации пользователя,
     * а не в процессе аутентификации.
     * 
     * @param email Email нового пользователя
     * @return UserDetails зарегистрированного пользователя
     * @throws IllegalArgumentException если пользователь с таким email уже
     *                                  существует
     */
    public UserDetails registerNewUser(String email) {
        if (userRepository.existsByEmail(email)) {
            log.warn("Attempt to register an already existing user: {}", email);
            throw new IllegalArgumentException("User with this email already exists");
        }

        log.info("Registering new user with email: {}", email);
        User newUser = User.create(email);
        userRepository.save(newUser);
        log.info("New user {} registered successfully.", email);

        return userDetailsService.loadUserByUsername(email);
    }
}
