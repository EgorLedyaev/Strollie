package com.strollie.route.service;

import com.strollie.route.model.dto.PlaceDto;
import com.strollie.route.model.dto.RouteRequest;
import com.strollie.route.model.dto.RouteResponse;
import com.strollie.route.util.DirectionsLinkBuilder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteOrchestrationService {

    private final GisPlaceService gisPlaceService;
    private final LlmFilterService llmFilterService;
    private final TspSolverService tspSolverService;
    

    public RouteOrchestrationService(
            GisPlaceService gisPlaceService,
            LlmFilterService llmFilterService,
            TspSolverService tspSolverService
    ) {
        this.gisPlaceService = gisPlaceService;
        this.llmFilterService = llmFilterService;
        this.tspSolverService = tspSolverService;
    }

    public RouteResponse generateRoute(RouteRequest request) {
        List<PlaceDto> candidates = gisPlaceService.findPlacesByCategories(
                request.getCity(),
                request.getCategories(),
                request.getStartPoint().getLat(),
                request.getStartPoint().getLon(),
                3000
        );

        List<PlaceDto> filtered = llmFilterService.filterAndRankPlaces(
                candidates,
                request.getDescription(),
                request.getDurationHours()
        );

        PlaceDto start = new PlaceDto();
        start.setId("start");
        start.setName("Start");
        start.setCategory("start");
        start.setLat(request.getStartPoint().getLat());
        start.setLon(request.getStartPoint().getLon());

        List<PlaceDto> ordered = tspSolverService.optimizeRoute(start, filtered);
        String url = DirectionsLinkBuilder.build2GisLink(request.getCity(), ordered);
        return RouteResponse.builder()
                .places(ordered)
                .directionsUrl(url)
                .build();
    }
}