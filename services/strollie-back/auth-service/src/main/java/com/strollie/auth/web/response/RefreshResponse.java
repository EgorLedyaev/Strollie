package com.strollie.auth.web.response;

import io.swagger.v3.oas.annotations.media.Schema;

public class RefreshResponse {
    @Schema(description = "Новый JWT access-токен")
    public String access_token;
    @Schema(description = "Тип токена", example = "Bearer")
    public String token_type;
}