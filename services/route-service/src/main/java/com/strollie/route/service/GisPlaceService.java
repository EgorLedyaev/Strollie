package com.strollie.route.service;

import com.strollie.route.client.GisApiClient;
import com.strollie.route.model.dto.PlaceDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GisPlaceService {

    private final GisApiClient gisApiClient;

    public GisPlaceService(GisApiClient gisApiClient) {
        this.gisApiClient = gisApiClient;
    }

    public List<PlaceDto> findPlacesByCategories(
            String city,
            List<String> categoryNames,
            double lat,
            double lon,
            int radiusMeters
    ) {
        return gisApiClient.searchPlaces(city, categoryNames, lat, lon, radiusMeters, 50);
    }
}