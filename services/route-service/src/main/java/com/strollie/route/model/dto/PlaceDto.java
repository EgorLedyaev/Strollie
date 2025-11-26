package com.strollie.route.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceDto {
    private String id;
    private String name;
    private String category;
    private double lat;
    private double lon;
    private String description;
}