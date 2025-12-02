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
@Schema(name = "Place", description = "Точка интереса (POI) в маршруте")
public class PlaceDto {
    @Schema(description = "Идентификатор места", example = "poi_123")
    private String id;
    @Schema(description = "Название", example = "Государственный Эрмитаж")
    private String name;
    @Schema(description = "Категория", example = "Музеи")
    private String category;
    @Schema(description = "Широта", example = "59.9398")
    private double lat;
    @Schema(description = "Долгота", example = "30.3146")
    private double lon;
    @Schema(description = "Краткое описание", example = "Крупнейший художественный музей России")
    private String description;

    @Schema(description = "Адрес", example = "Дворцовая пл., 2")
    private String address;
    @Schema(description = "Рейтинг по отзывам", example = "4.8")
    private Double rating;
    @Schema(description = "Количество отзывов", example = "12543")
    private Integer reviewCount;
    @Schema(description = "Время работы", example = "10:00–21:00")
    private String workingHours;
    @Schema(description = "Открыто ли сейчас", example = "true")
    private boolean openNow;
    @Schema(description = "URL фотографии", example = "https://example.com/photo.jpg")
    private String photoUrl;
}
