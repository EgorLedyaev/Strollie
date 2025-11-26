package com.strollie.route.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteSegment {
    private double fromLon;
    private double fromLat;
    private double toLon;
    private double toLat;
    private double distance;
    private double duration;
}