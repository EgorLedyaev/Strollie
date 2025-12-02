package com.strollie.route.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "RouteRequest", description = "Запрос на генерацию туристического маршрута")
public class RouteRequest {
    @NotBlank
    @Schema(description = "Город", example = "Санкт-Петербург")
    private String city;
    @Size(min = 1)
    @Schema(description = "Список категорий", example = "[\"Музеи\", \"Парки\"]")
    private List<String> categories;
    @NotBlank
    @Schema(description = "Описание интересов пользователя", example = "Хочу культурный маршрут и прогулки")
    private String description;
    @NotNull
    @Schema(description = "Длительность маршрута в часах", example = "6")
    private Integer durationHours;
    @NotNull
    @Schema(description = "Стартовая точка")
    private Point startPoint;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(name = "Point", description = "Координаты точки")
    public static class Point {
        @NotNull
        @Schema(description = "Широта", example = "59.9311")
        private Double lat;
        @NotNull
        @Schema(description = "Долгота", example = "30.3609")
        private Double lon;
    }
}
