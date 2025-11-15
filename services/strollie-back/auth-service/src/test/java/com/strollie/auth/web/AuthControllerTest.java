package com.strollie.auth.web;

import com.strollie.auth.repo.UserRepository;
import com.strollie.auth.service.KeyProvider;
import com.strollie.auth.service.MailService;
import com.strollie.auth.service.OtpService;
import com.strollie.auth.service.TokenService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.nimbusds.jose.jwk.JWKSet;

import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserRepository users;

    @MockBean
    private OtpService otpService;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private KeyProvider keyProvider;

    @MockBean
    private MailService mailService;

    @Test
    @DisplayName("/auth/request-code возвращает masked email и status=sent")
    void requestCode_ok() throws Exception {
        String email = "user@test.local";
        Mockito.when(users.findByEmail(email)).thenReturn(Optional.empty());

        mvc.perform(post("/auth/request-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("sent")))
                .andExpect(jsonPath("$.to", notNullValue()));
    }

    @Test
    @DisplayName("/auth/verify-code с отсутствующими полями → 400")
    void verify_missingFields() throws Exception {
        mvc.perform(post("/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("email and code required")));
    }

    @Test
    @DisplayName("/auth/verify-code с неверным кодом → 401")
    void verify_invalidCode() throws Exception {
        String email = "user@test.local";
        String code = "0000";
        Mockito.when(otpService.verify(email, code)).thenReturn(false);

        mvc.perform(post("/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"code\":\"" + code + "\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("invalid_code")));
    }

    @Test
    @DisplayName("/auth/verify-code при валидном коде возвращает токены")
    void verify_validCode_returnsTokens() throws Exception {
        String email = "user@test.local";
        String code = "123456";
        Mockito.when(otpService.verify(email, code)).thenReturn(true);
        Mockito.doNothing().when(otpService).invalidate(email);
        Mockito.when(tokenService.issueAccessToken(email)).thenReturn("access.jwt.token");
        Mockito.when(tokenService.issueRefreshToken(email)).thenReturn("refresh.jwt.token");

        mvc.perform(post("/auth/verify-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"code\":\"" + code + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token", not(isEmptyString())))
                .andExpect(jsonPath("$.refresh_token", not(isEmptyString())))
                .andExpect(jsonPath("$.token_type", is("Bearer")));
    }

    @Test
    @DisplayName("/auth/refresh без refresh_token → 401")
    void refresh_missingField() throws Exception {
        mvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("/auth/refresh с неверным refresh_token → 401")
    void refresh_invalidToken() throws Exception {
        Mockito.when(tokenService.refreshAccessToken("bad"))
                .thenThrow(new IllegalArgumentException("Invalid refresh token"));

        mvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refresh_token\":\"bad\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("/auth/refresh с валидным refresh_token → 200 и access_token")
    void refresh_validToken_returnsAccess() throws Exception {
        Mockito.when(tokenService.refreshAccessToken("good")).thenReturn("new.access.jwt");

        mvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refresh_token\":\"good\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token", not(isEmptyString())))
                .andExpect(jsonPath("$.token_type", is("Bearer")));
    }

    @Test
    @DisplayName("/auth/logout без refresh_token → 400")
    void logout_missingField() throws Exception {
        mvc.perform(post("/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("refresh_token required")));
    }

    @Test
    @DisplayName("/auth/logout с валидным refresh_token → ok")
    void logout_ok() throws Exception {
        Mockito.doNothing().when(tokenService).revokeRefreshToken("r1");

        mvc.perform(post("/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refresh_token\":\"r1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("ok")));
    }

    @Test
    @DisplayName("/oauth/jwks возвращает набор ключей")
    void jwks_ok() throws Exception {
        JWKSet jwkSet = JWKSet.parse("{\"keys\":[{\"kty\":\"RSA\",\"kid\":\"test\"}]} ");
        Mockito.when(keyProvider.getJwkSet()).thenReturn(jwkSet);

        mvc.perform(get("/oauth/jwks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.keys").isArray())
                .andExpect(jsonPath("$.keys[0].kid", is("test")));
    }
}