package com.strollie.route.service;

import com.strollie.route.client.GisApiClient;
import com.strollie.route.config.ApiKeysConfig;
import com.strollie.route.model.dto.PlaceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GisPlaceService {

    private final GisApiClient gisApiClient;
    private final ApiKeysConfig config;

    public List<PlaceDto> findPlacesByCategories(String city, List<String> categories, double lat, double lon, int radius) {
        int pageSize = config.getGis().getMaxPlacesPerCategory();

        return gisApiClient.searchPlaces(
                city,
                categories,
                lat,
                lon,
                radius,
                pageSize 
        );
    }
}