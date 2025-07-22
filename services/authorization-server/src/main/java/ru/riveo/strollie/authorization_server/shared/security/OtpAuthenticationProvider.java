package ru.riveo.strollie.authorization_server.shared.security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.UserRegistrationService;
import ru.riveo.strollie.authorization_server.features.passwordless_auth.request_otp.OtpRepository;

@Component
@RequiredArgsConstructor
public class OtpAuthenticationProvider implements AuthenticationProvider {

    private final OtpRepository otpRepository;
    private final UserDetailsService userDetailsService;
    private final UserRegistrationService userRegistrationService;

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
            otpRepository.deleteOtp(email);
            otpRepository.deleteAttempts(email);
            otpRepository.clearRateLimit(email);
            throw new BadCredentialsException("Exceeded maximum attempts");
        }

        if (!storedOtp.equals(otp)) {
            if (remainingAttempts <= 0) {
                otpRepository.deleteOtp(email);
                otpRepository.deleteAttempts(email);
                otpRepository.clearRateLimit(email);
            }
            throw new BadCredentialsException("Invalid OTP");
        }

        // OTP is valid, clean up
        otpRepository.deleteOtp(email);
        otpRepository.deleteAttempts(email);
        otpRepository.clearRateLimit(email);

        // Используем findExistingUser вместо registerUserIfNotFound
        // Это предотвращает автоматическую регистрацию новых пользователей через OTP
        UserDetails user = userRegistrationService.findExistingUser(email);
        return new OtpAuthenticationToken(email, null, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return OtpAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
