package com.strollie.route.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "RouteResponse", description = "Сгенерированный маршрут с точками и кратким описанием")
public class RouteResponse {

    @Schema(description = "Список точек маршрута")
    private List<PlaceDto> places;

    @Schema(description = "Ссылка на навигацию (например, Google Maps)", example = "https://maps.google.com/?q=...")
    private String directionsUrl;

    @Schema(description = "Описание маршрута", example = "Маршрут включает 3 музея и прогулку по набережной")
    private String description;

}
