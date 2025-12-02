package com.strollie.route.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "RouteSegment", description = "Отрезок маршрута между двумя точками")
public class RouteSegment {
    @Schema(description = "Долгота начала", example = "30.3200")
    private double fromLon;
    @Schema(description = "Широта начала", example = "59.9300")
    private double fromLat;
    @Schema(description = "Долгота конца", example = "30.3300")
    private double toLon;
    @Schema(description = "Широта конца", example = "59.9400")
    private double toLat;
    @Schema(description = "Дистанция (км)", example = "1.2")
    private double distance;
    @Schema(description = "Длительность (мин)", example = "15")
    private double duration;
}
