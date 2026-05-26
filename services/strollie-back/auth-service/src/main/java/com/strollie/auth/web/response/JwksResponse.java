package com.strollie.auth.web.response;

import io.swagger.v3.oas.annotations.media.Schema;

public class JwksResponse {
    @Schema(description = "Массив ключей")
    public Object keys;
}