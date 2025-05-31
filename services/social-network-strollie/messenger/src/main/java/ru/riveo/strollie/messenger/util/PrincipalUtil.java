package ru.riveo.strollie.messenger.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.UUID;

public class PrincipalUtil {

    public static UUID getUserId(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken token) {
            Object subClaim = token.getTokenAttributes().get("sub");

            if (subClaim == null) {
                throw new IllegalStateException("Claim 'sub' not found in token.");
            }

            try {
                return UUID.fromString(subClaim.toString());
            } catch (IllegalArgumentException e) {
                System.err.println("Warning: Claim 'sub' = '" + subClaim + "' is not a valid UUID.");
                throw new IllegalStateException("Claim 'sub' is not a valid UUID.", e);
            }
        }

        throw new IllegalStateException("Unsupported authentication type: " + authentication.getClass().getName());
    }


    public static String getUsername(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken token) {
            return token.getName();
        }
        return "unknown_user";
    }
}