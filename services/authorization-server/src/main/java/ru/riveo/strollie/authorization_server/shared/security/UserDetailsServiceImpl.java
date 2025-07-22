package ru.riveo.strollie.authorization_server.shared.security;

import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.shared.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        ru.riveo.strollie.authorization_server.shared.domain.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new User(
                user.email(),
                "", // We use OTP, so no password
                user.enabled(),
                user.accountNonExpired(),
                user.credentialsNonExpired(),
                user.accountNonLocked(),
                user.roles().stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toSet())
        );
    }
}
