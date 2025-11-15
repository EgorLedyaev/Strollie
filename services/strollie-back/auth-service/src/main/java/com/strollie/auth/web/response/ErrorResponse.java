package com.strollie.auth.web.response;

import io.swagger.v3.oas.annotations.media.Schema;

public class ErrorResponse {
    @Schema(description = "Описание ошибки", example = "invalid_code")
    public String error;
}