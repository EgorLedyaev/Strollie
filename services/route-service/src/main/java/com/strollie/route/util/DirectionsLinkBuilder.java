package com.strollie.route.util;

import com.strollie.route.model.dto.PlaceDto;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

public class DirectionsLinkBuilder {
    public static String build2GisLink(String city, List<PlaceDto> orderedPlaces) {
        List<PlaceDto> valid = orderedPlaces.stream()
                .filter(p -> p.getId() != null && p.getId().matches("\\d+"))
                .toList();
        String pointsRaw = valid.stream()
                .map(p -> formatPoint(p.getLon(), p.getLat(), p.getId()))
                .collect(Collectors.joining("|"));
        String pointsEnc = URLEncoder.encode(pointsRaw, StandardCharsets.UTF_8);
        return String.format("https://2gis.ru/directions/points/%s", pointsEnc);
    }

    private static String formatPoint(double lon, double lat, String id) {
        return String.format(Locale.US, "%f,%f;%s", lon, lat, id);
    }

    private static String toCitySlug(String city) {
        return "";
    }
}