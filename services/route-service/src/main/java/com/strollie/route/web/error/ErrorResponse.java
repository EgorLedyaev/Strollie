package com.strollie.route.web.error;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "ErrorResponse", description = "Стандартный формат ошибки API")
public class ErrorResponse {
    @Schema(description = "Момент времени", example = "2025-12-02T12:00:00Z")
    private OffsetDateTime timestamp;
    @Schema(description = "HTTP статус", example = "400")
    private int status;
    @Schema(description = "Название статуса", example = "Bad Request")
    private String error;
    @Schema(description = "Сообщение ошибки", example = "Validation failed")
    private String message;
    @Schema(description = "Путь запроса", example = "uri=/api/routes/generate")
    private String path;
    @Schema(description = "Нарушения валидации")
    private List<Violation> violations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "Violation", description = "Ошибка для конкретного поля")
    public static class Violation {
        @Schema(description = "Поле", example = "city")
        private String field;
        @Schema(description = "Сообщение", example = "must not be blank")
        private String message;
    }
}

