package com.strollie.route.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strollie.route.config.ApiKeysConfig;
import com.strollie.route.model.dto.PlaceDto;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class LlmApiClient {

    private final WebClient webClient;
    private final ApiKeysConfig apiKeysConfig;
    private final ObjectMapper objectMapper;

    public List<PlaceDto> filterPlaces(List<PlaceDto> candidates, String userDescription, int durationHours) {
        if (candidates == null || candidates.isEmpty()) {
            return Collections.emptyList();
        }

        try {
            // Отправляем упрощенные данные
            List<Map<String, String>> simplifiedCandidates = candidates.stream()
                    .map(p -> {
                        Map<String, String> map = new HashMap<>();
                        map.put("id", p.getId());
                        map.put("name", p.getName());
                        map.put("category", p.getCategory());
                        map.put("rating", String.valueOf(p.getRating()));
                        if (p.getDescription() != null) {
                            map.put("description", p.getDescription().substring(0, Math.min(p.getDescription().length(), 200)));
                        }
                        return map;
                    })
                    .toList();

            String candidatesJson = objectMapper.writeValueAsString(simplifiedCandidates);

            // --- ОБНОВЛЕННЫЙ ПРОМПТ С ЛОГИКОЙ ВРЕМЕНИ ---
            String systemPrompt = """
                    You are an expert travel route planner.
                    Your task is to select the BEST subset of places from the provided candidates to create a logical walking route.
                    
                    CRITICAL INSTRUCTIONS ON QUANTITY AND TIME:
                    1. Analyze the 'User description' to understand the desired vibe (relaxed vs. intense) and specific interests.
                    2. Strictly respect the 'Available duration'. 
                       - Estimate visit times: ~1.5h for Museums/Galleries, ~1h for Restaurants, ~30m for quick stops/Cafes/Parks.
                       - Account for walking time between stops.
                    3. Adjust the NUMBER of places based on duration:
                       - Short walk (1-2h): Select 1-3 high-quality matches.
                       - Medium walk (3-4h): Select 3-5 matches.
                       - Long day (5h+): Select 5-8 matches.
                    4. Do not overcrowd the route. It is better to pick fewer, highly relevant places than many random ones.
                    5. Sort the selected places by relevance to the user's wish.
                    """;
            // ---------------------------------------------

            String userPrompt = String.format(
                    "User description: %s\nAvailable duration: %d hours\n\nCandidates list JSON: %s",
                    userDescription,
                    durationHours,
                    candidatesJson
            );

            Map<String, Object> jsonSchema = Map.of(
                    "type", "object",
                    "properties", Map.of(
                            "places", Map.of(
                                    "type", "array",
                                    "items", Map.of(
                                            "type", "object",
                                            "properties", Map.of(
                                                    "id", Map.of("type", "string", "description", "The ID of the selected place")
                                            ),
                                            "required", List.of("id"),
                                            "additionalProperties", false
                                    )
                            )
                    ),
                    "required", List.of("places"),
                    "additionalProperties", false
            );

            String responseContent = callLlm(systemPrompt, userPrompt, jsonSchema, "filter_response");

            if (responseContent == null) return candidates;

            LlmResponseWrapper wrapper = objectMapper.readValue(responseContent, LlmResponseWrapper.class);

            if (wrapper.getPlaces() != null && !wrapper.getPlaces().isEmpty()) {
                List<String> selectedIds = wrapper.getPlaces().stream().map(PlaceDto::getId).toList();

                List<PlaceDto> filtered = candidates.stream()
                        .filter(c -> selectedIds.contains(c.getId()))
                        .toList();

                return filtered.isEmpty() ? candidates : filtered;
            }

            return candidates;

        } catch (Exception e) {
            log.error("Unexpected error during LLM filtering", e);
            return candidates;
        }
    }

    public String generateRouteDescription(List<PlaceDto> route, String userDescription) {
        if (route == null || route.isEmpty()) {
            return "Маршрут не найден.";
        }

        try {
            String routeSummary = route.stream()
                    .map(p -> String.format("- %s (%s)", p.getName(), p.getCategory()))
                    .collect(Collectors.joining("\n"));

            String systemPrompt = """
                    You are an enthusiastic travel guide.
                    Write a short, engaging summary (3-5 sentences) of the walking route provided.
                    Mention key highlights and the overall vibe.
                    Language: Russian.
                    """;

            String userPrompt = String.format(
                    "User's wish: %s\n\nRoute Sequence:\n%s",
                    userDescription,
                    routeSummary
            );

            Map<String, Object> jsonSchema = Map.of(
                    "type", "object",
                    "properties", Map.of(
                            "description", Map.of(
                                    "type", "string",
                                    "description", "A short text description of the route in Russian"
                            )
                    ),
                    "required", List.of("description"),
                    "additionalProperties", false
            );

            String responseContent = callLlm(systemPrompt, userPrompt, jsonSchema, "description_response");

            if (responseContent == null) return "Приятной прогулки по выбранным местам!";

            DescriptionResponseWrapper wrapper = objectMapper.readValue(responseContent, DescriptionResponseWrapper.class);
            return wrapper.getDescription() != null ? wrapper.getDescription() : "Приятной прогулки!";

        } catch (Exception e) {
            log.error("Error generating route description", e);
            return "Приятной прогулки!";
        }
    }

    private String callLlm(String systemPrompt, String userPrompt, Map<String, Object> schema, String schemaName) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", apiKeysConfig.getLlm().getModel());
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        ));
        requestBody.put("temperature", 0.5);

        requestBody.put("response_format", Map.of(
                "type", "json_schema",
                "json_schema", Map.of(
                        "name", schemaName,
                        "strict", true,
                        "schema", schema
                )
        ));

        requestBody.put("max_tokens", 1000);

        try {
            String rawResponse = webClient.post()
                    .uri(apiKeysConfig.getLlm().getBaseUrl() + "/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKeysConfig.getLlm().getKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (rawResponse == null || rawResponse.isBlank()) return null;

            JsonNode rootNode = objectMapper.readTree(rawResponse);

            if (rootNode.has("error")) {
                log.error("LLM API Error: {}", rootNode.get("error").toPrettyString());
                return null;
            }

            JsonNode choices = rootNode.get("choices");
            if (choices != null && !choices.isEmpty()) {
                return choices.get(0).get("message").get("content").asText();
            }
        } catch (Exception e) {
            log.error("LLM Call Failed: {}", e.getMessage());
        }
        return null;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class LlmResponseWrapper {
        private List<PlaceDto> places;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class DescriptionResponseWrapper {
        private String description;
    }

}