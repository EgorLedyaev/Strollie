package ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.port.UserAccount;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp.port.UserAccountFinder;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;

import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
public class OtpAuthenticationProvider implements AuthenticationProvider {

    private final OtpRepository otpRepository;
    private final UserAccountFinder userAccountFinder;


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (!(authentication instanceof OtpAuthenticationToken otpToken)) {
            return null;
        }

        String email = otpToken.getEmail();
        String otp = otpToken.getOtp();

        String storedOtp = otpRepository.findOtp(email).orElse(null);

        if (storedOtp == null) {
            throw new BadCredentialsException("Invalid or expired OTP");
        }

        // Используем атомарную операцию для уменьшения попыток и получения оставшегося
        // количества
        long remainingAttempts = otpRepository.decrementAndGetAttempts(email);

        if (remainingAttempts < 0) {
            cleanupOtpData(email);
            throw new BadCredentialsException("Exceeded maximum attempts");
        }

        if (!storedOtp.equals(otp)) {
            if (remainingAttempts <= 0) {
                cleanupOtpData(email);
            }
            throw new BadCredentialsException("Invalid OTP");
        }

        // OTP is valid, clean up
        cleanupOtpData(email);

        UserAccount userAccount = userAccountFinder.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Authentication successful for OTP, but user not found: {}", email);
                    return new BadCredentialsException("Invalid credentials");
                });

        if (!userAccount.isEnabled() || !userAccount.isAccountNonLocked()) {
            throw new BadCredentialsException("User account is disabled or locked");
        }

        // Создаем токен, используя данные из нашей чистой модели UserAccount
        return new OtpAuthenticationToken(
                userAccount.email(),
                null,
                userAccount.roles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toSet())
        );
    }

    private void cleanupOtpData(String email) {
        otpRepository.deleteOtp(email);
        otpRepository.deleteAttempts(email);
        otpRepository.clearRateLimit(email);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return OtpAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
