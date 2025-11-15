package com.strollie.auth.web.response;

import io.swagger.v3.oas.annotations.media.Schema;

public class RequestCodeResponse {
    @Schema(description = "Статус отправки", example = "sent")
    public String status;
    @Schema(description = "Маскированный email получателя", example = "**@test.local")
    public String to;
}