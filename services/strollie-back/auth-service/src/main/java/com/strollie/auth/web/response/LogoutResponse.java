package com.strollie.auth.web.response;

import io.swagger.v3.oas.annotations.media.Schema;

public class LogoutResponse {
    @Schema(description = "Статус операции", example = "ok")
    public String status;
}