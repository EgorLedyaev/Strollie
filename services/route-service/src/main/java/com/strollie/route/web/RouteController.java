package com.strollie.route.web;

import com.strollie.route.model.dto.RouteRequest;
import com.strollie.route.model.dto.RouteResponse;
import com.strollie.route.service.RouteOrchestrationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/routes")
@Tag(name = "Routes")
public class RouteController {

    private final RouteOrchestrationService orchestrationService;

    public RouteController(RouteOrchestrationService orchestrationService) {
        this.orchestrationService = orchestrationService;
    }

    @PostMapping("/generate")
    @Operation(summary = "Генерация туристического маршрута")
    public ResponseEntity<RouteResponse> generateRoute(@Valid @RequestBody RouteRequest request) {
        return ResponseEntity.ok(orchestrationService.generateRoute(request));
    }
}