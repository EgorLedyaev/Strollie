package ru.riveo.strollie.authorization_server.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.riveo.strollie.authorization_server.entity.UserEntity;
import ru.riveo.strollie.authorization_server.repository.UserRepository;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new User(
                userEntity.getEmail(),
                userEntity.getPassword(),
                userEntity.isEnabled(),
                userEntity.isAccountNonExpired(),
                userEntity.isCredentialsNonExpired(),
                userEntity.isAccountNonLocked(),
                userEntity.getRoles().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet())
        );
    }

    @Transactional
    public UserDetails registerUserIfNotFound(String email) {
        if (userRepository.existsByEmail(email)) {
            log.info("User with email {} already exists. Loading existing user.", email);
            return loadUserByUsername(email);
        }

        log.info("Registering new user with email: {}", email);

        UserEntity newUserEntity = new UserEntity();
        newUserEntity.setEmail(email);
        newUserEntity.setUsername(email);
        newUserEntity.setPassword(passwordEncoder.encode(""));
        newUserEntity.setRoles(Set.of("ROLE_USER"));
        newUserEntity.setEnabled(true);

        userRepository.save(newUserEntity);
        log.info("New user {} registered successfully.", email);
        return loadUserByUsername(email);
    }

}
