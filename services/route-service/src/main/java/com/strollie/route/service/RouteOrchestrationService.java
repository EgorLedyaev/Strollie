package com.strollie.route.service;

import com.strollie.route.model.dto.PlaceDto;
import com.strollie.route.model.dto.RouteRequest;
import com.strollie.route.model.dto.RouteResponse;
import com.strollie.route.util.DirectionsLinkBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteOrchestrationService {

    private final GisPlaceService gisPlaceService;
    private final LlmFilterService llmFilterService;
    private final TspSolverService tspSolverService;

    public RouteResponse generateRoute(RouteRequest request) {
        log.info("Starting route generation. City: {}, Categories: {}, Start: [{}, {}], Duration: {}h",
                request.getCity(),
                request.getCategories(),
                request.getStartPoint().getLat(),
                request.getStartPoint().getLon(),
                request.getDurationHours());

        // Этап 1: Поиск в GIS
        log.info("Step 1/4: Fetching candidates from GIS service...");
        List<PlaceDto> candidates = gisPlaceService.findPlacesByCategories(
                request.getCity(),
                request.getCategories(),
                request.getStartPoint().getLat(),
                request.getStartPoint().getLon(),
                3000
        );
        log.info("GIS search completed. Candidates found: {}", candidates.size());

        if (candidates.isEmpty()) {
            log.warn("No candidates found in GIS. Returning empty route.");
        }

        // Этап 2: Фильтрация через LLM
        log.info("Step 2/4: Filtering candidates via LLM service. Input size: {}", candidates.size());
        List<PlaceDto> filtered = llmFilterService.filterAndRankPlaces(
                candidates,
                request.getDescription(),
                request.getDurationHours()
        );
        log.info("LLM filtering completed. Selected places: {}", filtered.size());

        // Этап 3: Подготовка стартовой точки
        PlaceDto start = new PlaceDto();
        start.setId("start");
        start.setName("Start");
        start.setCategory("start");
        start.setLat(request.getStartPoint().getLat());
        start.setLon(request.getStartPoint().getLon());

        // Этап 4: Оптимизация маршрута (TSP)
        log.info("Step 3/4: Optimizing route order (TSP) for {} points (including start)...", filtered.size() + 1);
        List<PlaceDto> ordered = tspSolverService.optimizeRoute(start, filtered);
        log.info("Route optimization completed. Final sequence size: {}", ordered.size());

        // Генерация ссылки
        log.info("Step 4/4: Building navigation link...");
        String url = DirectionsLinkBuilder.build2GisLink(request.getCity(), ordered);
        log.info("Directions link generated: {}", url);

        log.info("Route generation finished successfully.");

        return RouteResponse.builder()
                .places(ordered)
                .directionsUrl(url)
                .build();
    }

}