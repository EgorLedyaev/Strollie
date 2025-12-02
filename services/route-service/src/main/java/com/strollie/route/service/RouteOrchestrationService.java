package com.strollie.route.service;

import com.strollie.route.client.GisApiClient;
import com.strollie.route.client.LlmApiClient;
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

    private static final int DEFAULT_RADIUS_METERS = 3000;
    private final GisApiClient gisApiClient;
    private final LlmFilterService llmFilterService;
    private final LlmApiClient llmApiClient;
    private final TspSolverService tspSolverService;
    private final CategoryEnricherService categoryEnricherService;

    public RouteResponse generateRoute(RouteRequest request) {
        log.info("=== ROUTE GENERATION START ===");
        log.info("City: {}, Categories: {}, Duration: {}h",
                request.getCity(), request.getCategories(), request.getDurationHours());
        log.info("User description: '{}'", request.getDescription());

        // Step 1: Обогащение категорий на основе описания пользователя
        log.info("Step 1/5: Enriching categories based on user description...");
        List<String> enrichedCategories = categoryEnricherService.enrichCategories(
                request.getCategories(),
                request.getDescription(),
                request.getCity()
        );
        log.info("Categories after enrichment: {}", enrichedCategories);

        // Step 2: Поиск мест в GIS
        log.info("Step 2/5: Fetching places from GIS...");
        List<PlaceDto> candidates = gisApiClient.searchPlaces(
                request.getCity(),
                enrichedCategories,
                request.getStartPoint().getLat(),
                request.getStartPoint().getLon(),
                DEFAULT_RADIUS_METERS,
                30
        );
        log.info("GIS returned {} candidates", candidates.size());

        if (candidates.isEmpty()) {
            log.warn("No candidates found. Returning empty route.");
            return emptyRoute();
        }

        // Step 3: LLM фильтрация
        log.info("Step 3/5: LLM filtering {} candidates...", candidates.size());
        List<PlaceDto> filtered = llmFilterService.filterAndRankPlaces(
                candidates,
                request.getDescription(),
                request.getDurationHours()
        );
        log.info("After LLM filter: {} places", filtered.size());

        if (filtered.isEmpty()) {
            log.warn("LLM returned 0 results, using candidates sorted by rating as fallback");
            filtered = candidates.stream()
                    .sorted((a, b) -> {
                        Double ra = a.getRating();
                        Double rb = b.getRating();
                        if (ra == null && rb == null) return 0;
                        if (ra == null) return 1;
                        if (rb == null) return -1;
                        return rb.compareTo(ra);
                    })
                    .limit(calculateTargetPlaces(request.getDurationHours()))
                    .toList();
            log.info("Fallback selected {} places", filtered.size());
        }

        // Step 4: TSP оптимизация
        log.info("Step 4/5: Optimizing route order (TSP)...");
        PlaceDto start = createStartPoint(request);
        List<PlaceDto> ordered = tspSolverService.optimizeRoute(start, filtered);
        log.info("Route optimized: {} points", ordered.size());

        // Step 5: Генерация описания
        log.info("Step 5/5: Generating route description...");
        String description = llmApiClient.generateRouteDescription(ordered, request.getDescription());

        String url = DirectionsLinkBuilder.build2GisLink(request.getCity(), ordered);

        log.info("=== ROUTE GENERATION COMPLETE ===");

        return RouteResponse.builder()
                .places(ordered)
                .description(description)
                .directionsUrl(url)
                .build();
    }

    private int calculateTargetPlaces(int durationHours) {
        return Math.max(3, durationHours * 2);
    }

    private PlaceDto createStartPoint(RouteRequest request) {
        return PlaceDto.builder()
                .id("start")
                .name("Начальная точка")
                .category("start")
                .lat(request.getStartPoint().getLat())
                .lon(request.getStartPoint().getLon())
                .build();
    }

    private RouteResponse emptyRoute() {
        return RouteResponse.builder()
                .places(List.of())
                .description("К сожалению, не удалось найти подходящие места.")
                .directionsUrl(null)
                .build();
    }

}