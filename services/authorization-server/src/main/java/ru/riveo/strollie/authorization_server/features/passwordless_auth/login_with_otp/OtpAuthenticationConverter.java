package ru.riveo.strollie.authorization_server.features.passwordless_auth.login_with_otp;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.web.authentication.AuthenticationConverter;
import org.springframework.util.StringUtils;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Конвертер для трансформации HTTP-запроса на /oauth2/token с
 * grant_type=urn:custom:otp
 * в токен OtpAuthenticationToken для аутентификации через OTP
 */
public class OtpAuthenticationConverter implements AuthenticationConverter {

    // Константы для параметров запроса
    private static final String OTP_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:otp"; // Используем URN формат
                                                                                         // согласно RFC 6749
    private static final String EMAIL_PARAM = "email";
    private static final String OTP_PARAM = "otp";

    @Override
    public Authentication convert(HttpServletRequest request) {
        // Используем стандартные возможности Spring Security для OAuth2
        String grantType = request.getParameter(OAuth2ParameterNames.GRANT_TYPE);

        if (!OTP_GRANT_TYPE.equals(grantType)) {
            return null; // Этот конвертер не применим к данному запросу
        }

        // Извлекаем необходимые параметры
        String email = request.getParameter(EMAIL_PARAM);
        String otp = request.getParameter(OTP_PARAM);

        // Валидируем обязательные параметры
        if (!StringUtils.hasText(email) || !StringUtils.hasText(otp)) {
            OAuth2Error error = new OAuth2Error(
                    OAuth2ErrorCodes.INVALID_REQUEST,
                    "email and otp parameters are required for OTP authentication",
                    null);
            throw new OAuth2AuthenticationException(error);
        }

        // Создаем токен аутентификации с email и otp
        return new OtpAuthenticationToken(email, otp);
    }
}
