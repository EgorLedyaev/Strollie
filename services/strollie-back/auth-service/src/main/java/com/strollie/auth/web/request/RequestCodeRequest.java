package com.strollie.auth.web.request;

import io.swagger.v3.oas.annotations.media.Schema;

public class RequestCodeRequest {
    @Schema(description = "Email пользователя", example = "user@test.local")
    public String email;
}