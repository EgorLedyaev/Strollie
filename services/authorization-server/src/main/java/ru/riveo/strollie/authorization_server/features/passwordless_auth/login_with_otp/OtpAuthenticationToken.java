package ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.Assert;

import lombok.Getter;

@Getter
public class OtpAuthenticationToken extends AbstractAuthenticationToken {
    private final String email;
    private final String otp;

    public OtpAuthenticationToken(String email, String otp) {
        super(null);
        this.email = email;
        this.otp = otp;
        setAuthenticated(false);
    }

    public OtpAuthenticationToken(String email, String otp, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.email = email;
        this.otp = otp;
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return this.otp;
    }

    @Override
    public Object getPrincipal() {
        return this.email;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        Assert.isTrue(!isAuthenticated,
                "Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
        super.setAuthenticated(false);
    }
}
