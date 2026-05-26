package com.strollie.auth.web.request;

import io.swagger.v3.oas.annotations.media.Schema;

public class VerifyCodeRequest {
    @Schema(description = "Email пользователя", example = "user@test.local")
    public String email;
    @Schema(description = "OTP-код", example = "123456")
    public String code;
}