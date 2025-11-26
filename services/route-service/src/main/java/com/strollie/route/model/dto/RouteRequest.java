package com.strollie.route.model.dto;

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
public class RouteRequest {
    @NotBlank
    private String city;
    @Size(min = 1)
    private List<String> categories;
    @NotBlank
    private String description;
    @NotNull
    private Integer durationHours;
    @NotNull
    private Point startPoint;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Point {
        @NotNull
        private Double lat;
        @NotNull
        private Double lon;
    }
}