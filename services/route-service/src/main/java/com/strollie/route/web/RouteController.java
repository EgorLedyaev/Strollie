package com.strollie.route.web;

import com.strollie.route.model.dto.RouteRequest;
import com.strollie.route.model.dto.RouteResponse;
import com.strollie.route.service.RouteOrchestrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
@Tag(name = "Routes")
public class RouteController {

    private final RouteOrchestrationService orchestrationService;

    public RouteController(RouteOrchestrationService orchestrationService) {
        this.orchestrationService = orchestrationService;
    }

    @PostMapping("/generate")
    @Operation(
            summary = "Генерация туристического маршрута",
            description = "На основе предпочтений пользователя и начальной точки возвращает сгенерированный маршрут"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Маршрут успешно сгенерирован",
                    content = @Content(schema = @Schema(implementation = RouteResponse.class))),
            @ApiResponse(responseCode = "400", description = "Ошибка валидации входных данных"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    public ResponseEntity<RouteResponse> generateRoute(
            @Valid @RequestBody
            @RequestBody(description = "Параметры генерации маршрута",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = RouteRequest.class),
                            examples = {
                                    @ExampleObject(name = "Пример",
                                            value = "{\n  \"city\": \"Санкт-Петербург\",\n  \"categories\": [\"Музеи\", \"Парки\"],\n  \"description\": \"Культура и прогулки\",\n  \"durationHours\": 6,\n  \"startPoint\": { \"lat\": 59.9311, \"lon\": 30.3609 }\n}")
                            }
                    )
            ) RouteRequest request) {
        return ResponseEntity.ok(orchestrationService.generateRoute(request));
    }

}
