package com.strollie.route.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strollie.route.config.ApiKeysConfig;
import com.strollie.route.model.dto.CategoryDto;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryEnricherService {

    private static final int MAX_CATEGORIES = 8;
    private static final int MAX_ADDED_CATEGORIES = 4;
    private final WebClient webClient;
    private final ApiKeysConfig config;
    private final CategoryCacheService categoryCacheService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<String> enrichCategories(List<String> originalCategories, String userDescription, String city) {
        if (userDescription == null || userDescription.isBlank()) {
            log.info(">>> CATEGORY ENRICHER: No description provided, using original categories");
            return originalCategories;
        }

        List<String> allowedCategories = categoryCacheService.getAllCategories().stream()
                .map(CategoryDto::getName)
                .toList();

        if (allowedCategories.isEmpty()) {
            log.warn(">>> CATEGORY ENRICHER: Cache is empty, skipping enrichment");
            return originalCategories;
        }

        log.info(">>> CATEGORY ENRICHER: Analyzing description: '{}'", userDescription);

        try {
            String prompt = buildPrompt(originalCategories, userDescription, city, allowedCategories);
            String llmResponse = callLlm(prompt);

            if (llmResponse == null || llmResponse.isBlank()) {
                return originalCategories;
            }

            List<String> suggestedCategories = parseResponse(llmResponse);
            List<String> validatedSuggestions = validateSuggestions(suggestedCategories, allowedCategories);
            List<String> enrichedCategories = mergeCategories(originalCategories, validatedSuggestions);

            log.info(">>> CATEGORY ENRICHER: Enriched categories: {}", enrichedCategories);
            return enrichedCategories;

        } catch (Exception e) {
            log.error(">>> CATEGORY ENRICHER: Error during enrichment: {}", e.getMessage());
            return originalCategories;
        }
    }

    private List<String> validateSuggestions(List<String> suggestions, List<String> allowed) {
        Set<String> allowedSetLower = allowed.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        Map<String, String> originalNameMap = allowed.stream()
                .collect(Collectors.toMap(k -> k.toLowerCase().trim(), v -> v, (v1, v2) -> v1));

        List<String> valid = new ArrayList<>();
        for (String suggestion : suggestions) {
            String sLower = suggestion.toLowerCase().trim();
            if (allowedSetLower.contains(sLower)) {
                valid.add(originalNameMap.get(sLower));
            } else {
                log.warn(">>> CATEGORY ENRICHER: Ignored invalid category from LLM: '{}'", suggestion);
            }
        }
        return valid;
    }

    private String buildPrompt(List<String> currentCategories, String description, String city, List<String> allowedCategories) {
        String allowedListString = String.join(", ", allowedCategories);

        return String.format("""
                        Ты помощник для планирования маршрутов.
                        
                        Город: %s
                        Текущие категории поиска: %s
                        Запрос пользователя: "%s"
                        
                        СПИСОК ДОСТУПНЫХ КАТЕГОРИЙ:
                        [%s]
                        
                        Задача: Выбери из СПИСКА ДОСТУПНЫХ КАТЕГОРИЙ от 0 до 4 дополнительных категорий, которые лучше всего подходят под запрос пользователя и дополняют текущие.
                        
                        Строгие правила:
                        1. ИСПОЛЬЗУЙ ТОЛЬКО НАЗВАНИЯ ИЗ СПИСКА ВЫШЕ.
                        2. Не повторяй категории, которые уже есть в "Текущие категории поиска".
                        3. Если подходящих категорий в списке нет, верни пустой массив.
                        
                        Ответь JSON в формате:
                        {"categories": ["Название 1", "Название 2"]}
                        """,
                city,
                String.join(", ", currentCategories),
                description,
                allowedListString
        );
    }

    private String callLlm(String prompt) {
        try {
            Map<String, Object> jsonSchema = Map.of(
                    "name", "category_response",
                    "strict", true,
                    "schema", Map.of(
                            "type", "object",
                            "properties", Map.of(
                                    "categories", Map.of(
                                            "type", "array",
                                            "items", Map.of("type", "string"),
                                            "description", "Список категорий из разрешенного списка"
                                    )
                            ),
                            "required", List.of("categories"),
                            "additionalProperties", false
                    )
            );

            Map<String, Object> request = Map.of(
                    "model", config.getLlm().getModel(),
                    "max_tokens", 500,
                    "messages", List.of(
                            Map.of("role", "user", "content", prompt)
                    ),
                    "response_format", Map.of(
                            "type", "json_schema",
                            "json_schema", jsonSchema
                    )
            );

            String response = webClient.post()
                    .uri(config.getLlm().getBaseUrl() + "/chat/completions")
                    .header("Authorization", "Bearer " + config.getLlm().getKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractContent(response);
        } catch (Exception e) {
            log.error(">>> CATEGORY ENRICHER: LLM call failed: {}", e.getMessage());
            return null;
        }
    }

    private String extractContent(String response) {
        try {
            var root = objectMapper.readTree(response);
            var choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                return choices.get(0).path("message").path("content").asText();
            }
        } catch (Exception e) {
            log.error(">>> CATEGORY ENRICHER: Failed to extract content: {}", e.getMessage());
        }
        return null;
    }

    private List<String> parseResponse(String response) {
        try {
            CategoryResponse parsed = objectMapper.readValue(response, CategoryResponse.class);
            if (parsed.getCategories() != null) {
                return parsed.getCategories();
            }
        } catch (Exception e) {
            log.warn(">>> CATEGORY ENRICHER: Failed to parse response: {}", e.getMessage());
        }
        return List.of();
    }

    private List<String> mergeCategories(List<String> original, List<String> suggested) {
        Set<String> seen = new HashSet<>();
        List<String> result = new ArrayList<>();

        for (String cat : original) {
            if (seen.add(cat.toLowerCase().trim())) {
                result.add(cat);
            }
        }

        for (String cat : suggested) {
            if (result.size() >= MAX_CATEGORIES) break;
            if (seen.add(cat.toLowerCase().trim())) {
                result.add(cat);
                log.info(">>> CATEGORY ENRICHER: Added new category: '{}'", cat);
            }
        }

        return result;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class CategoryResponse {
        private List<String> categories;
    }

}