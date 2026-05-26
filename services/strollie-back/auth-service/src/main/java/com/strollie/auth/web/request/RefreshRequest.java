package com.strollie.auth.web.request;

import io.swagger.v3.oas.annotations.media.Schema;

public class RefreshRequest {
    @Schema(description = "Refresh-токен", example = "3b1f6c2e-5b8a-4c0b-9e21-0d2a1b8c7f2e")
    public String refresh_token;
}