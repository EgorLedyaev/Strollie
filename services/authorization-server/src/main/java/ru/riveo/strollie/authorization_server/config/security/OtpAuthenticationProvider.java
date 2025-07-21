package ru.riveo.strollie.authorization_server.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import ru.riveo.strollie.authorization_server.service.OtpService;
import ru.riveo.strollie.authorization_server.service.UserService;

@Component
@RequiredArgsConstructor
public class OtpAuthenticationProvider implements AuthenticationProvider {

    private final OtpService otpService;
    private final UserService userService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String otp = authentication.getCredentials().toString();

        if (otpService.verifyOtp(email, otp)) {
            UserDetails user = userService.loadUserByUsername(email);
            return new UsernamePasswordAuthenticationToken(user, otp, user.getAuthorities());
        } else {
            return new BadCredentialsException("Invalid OTP").getAuthenticationRequest();
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }

}
