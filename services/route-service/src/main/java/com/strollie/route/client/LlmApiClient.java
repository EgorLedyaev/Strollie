package com.strollie.route.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
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
            String candidatesJson = objectMapper.writeValueAsString(candidates);

            String systemPrompt = """
                    You are a smart travel assistant.
                    Filter the provided list of places based on the user's description and available time.
                    Sort them by relevance.
                    
                    IMPORTANT: You must output strictly valid JSON in the following format:
                    {
                      "places": [
                        ... (list of selected PlaceDto objects)
                      ]
                    }
                    Do not include any markdown formatting, backticks, or explanatory text. Just the JSON object.
                    """;

            String userPrompt = String.format(
                    "User description: %s\nAvailable duration: %d hours\n\nCandidates list JSON: %s",
                    userDescription,
                    durationHours,
                    candidatesJson
            );

            String responseContent = callLlm(systemPrompt, userPrompt);

            if (responseContent == null) return candidates;

            LlmResponseWrapper wrapper = objectMapper.readValue(responseContent, LlmResponseWrapper.class);
            return wrapper.getPlaces() != null ? wrapper.getPlaces() : candidates;

        } catch (JsonProcessingException e) {
            log.error("JSON processing error while filtering places", e);
            return candidates;
        } catch (Exception e) {
            log.error("Unexpected error during LLM request", e);
            return candidates;
        }
    }

    public String generateRouteDescription(List<PlaceDto> route, String userDescription) {
        if (route == null || route.isEmpty()) {
            return "Маршрут не найден.";
        }

        try {
            String routeJson = objectMapper.writeValueAsString(route);

            String systemPrompt = """
                    You are an enthusiastic travel guide.
                    Write a short, engaging summary (3-5 sentences) of the walking route provided.
                    Mention key highlights and the overall vibe.
                    Language: Russian.
                    
                    IMPORTANT: You must output strictly valid JSON in the following format:
                    {
                      "description": "Your text here..."
                    }
                    """;

            String userPrompt = String.format(
                    "User's original wish: %s\n\nFinal Route Sequence: %s",
                    userDescription,
                    routeJson
            );

            String responseContent = callLlm(systemPrompt, userPrompt);

            if (responseContent == null) return "Описание маршрута временно недоступно.";

            DescriptionResponseWrapper wrapper = objectMapper.readValue(responseContent, DescriptionResponseWrapper.class);
            return wrapper.getDescription();

        } catch (Exception e) {
            log.error("Error generating route description", e);
            return "Приятной прогулки по выбранным местам!";
        }
    }

    private String callLlm(String systemPrompt, String userPrompt) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", apiKeysConfig.getLlm().getModel());
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        ));
        requestBody.put("temperature", 0.4); // Чуть выше для креативности в описании
        requestBody.put("response_format", Map.of("type", "json_object"));
        requestBody.put("max_tokens", apiKeysConfig.getLlm().getMaxTokens());

        String rawResponse = webClient.post()
                .uri(apiKeysConfig.getLlm().getBaseUrl() + "/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKeysConfig.getLlm().getKey())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (rawResponse == null || rawResponse.isBlank()) {
            log.error("LLM returned empty response");
            return null;
        }

        try {
            JsonNode rootNode = objectMapper.readTree(rawResponse);
            if (rootNode.has("error")) {
                log.error("LLM API Error: {}", rootNode.get("error").toPrettyString());
                return null;
            }
            JsonNode choices = rootNode.get("choices");
            if (choices != null && !choices.isEmpty()) {
                return choices.get(0).get("message").get("content").asText();
            }
        } catch (JsonProcessingException e) {
            log.error("Error parsing LLM response", e);
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