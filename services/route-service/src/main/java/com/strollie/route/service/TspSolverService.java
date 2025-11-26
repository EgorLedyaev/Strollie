package com.strollie.route.service;

import com.strollie.route.model.dto.PlaceDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TspSolverService {

    public List<PlaceDto> optimizeRoute(PlaceDto startPoint, List<PlaceDto> places) {
        List<PlaceDto> route = new ArrayList<>();
        route.add(startPoint);
        Set<PlaceDto> unvisited = new HashSet<>(places);
        PlaceDto current = startPoint;
        while (!unvisited.isEmpty()) {
            PlaceDto c = current;
            PlaceDto nearest = unvisited.stream()
                    .min(Comparator.comparingDouble(p -> distanceMeters(c, p)))
                    .orElseThrow();
            route.add(nearest);
            unvisited.remove(nearest);
            current = nearest;
        }
        return route;
    }

    private double distanceMeters(PlaceDto a, PlaceDto b) {
        double lat1 = Math.toRadians(a.getLat());
        double lat2 = Math.toRadians(b.getLat());
        double dLat = lat2 - lat1;
        double dLon = Math.toRadians(b.getLon() - a.getLon());
        double sinLat = Math.sin(dLat / 2);
        double sinLon = Math.sin(dLon / 2);
        double h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
        double c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
        return 6371000.0 * c;
    }
    
}