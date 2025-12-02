# Сборка файлов из src\main

## Файл: `src\main\java\com\strollie\route\RouteApplication.java`

```java
package com.strollie.route;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RouteApplication {

    public static void main(String[] args) {
        SpringApplication.run(RouteApplication.class, args);
    }

}

```

---

## Файл: `src\main\java\com\strollie\route\cache\CityRegionCache.java`

```java
package com.strollie.route.cache;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class CityRegionCache {

    private static final Duration DEFAULT_TTL = Duration.ofHours(24);

    private final Map<String, CacheEntry<String>> cities = new ConcurrentHashMap<>();
    private final Map<String, CacheEntry<String>> rubrics = new ConcurrentHashMap<>();

    private long cacheHits = 0;
    private long cacheMisses = 0;

    public String get(String city) {
        return getFromCache(cities, normalizeKey(city)).orElse(null);
    }

    public void put(String city, String id) {
        putToCache(cities, normalizeKey(city), id);
    }

    public Optional<String> getRubricId(String regionId, String category) {
        String key = rubricKey(regionId, category);
        return getFromCache(rubrics, key);
    }

    public void putRubricId(String regionId, String category, String rubricId) {
        String key = rubricKey(regionId, category);
        putToCache(rubrics, key, rubricId);
    }

    private <T> Optional<T> getFromCache(Map<String, CacheEntry<T>> cache, String key) {
        CacheEntry<T> entry = cache.get(key);

        if (entry == null) {
            cacheMisses++;
            return Optional.empty();
        }

        if (entry.isExpired()) {
            cache.remove(key);
            cacheMisses++;
            return Optional.empty();
        }

        cacheHits++;
        return Optional.of(entry.value());
    }

    private <T> void putToCache(Map<String, CacheEntry<T>> cache, String key, T value) {
        cache.put(key, new CacheEntry<>(value, Instant.now().plus(DEFAULT_TTL)));
    }

    private String normalizeKey(String key) {
        return key == null ? "" : key.trim().toLowerCase();
    }

    private String rubricKey(String regionId, String category) {
        return regionId + ":" + normalizeKey(category);
    }

    public CacheStats getStats() {
        return new CacheStats(
                cities.size(),
                rubrics.size(),
                cacheHits,
                cacheMisses
        );
    }

    public void clearAll() {
        cities.clear();
        rubrics.clear();
        cacheHits = 0;
        cacheMisses = 0;
        log.info("Cache cleared");
    }

    private record CacheEntry<T>(T value, Instant expiresAt) {
        boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }
    }

    public record CacheStats(int cityEntries, int rubricEntries, long hits, long misses) {
        public double hitRate() {
            long total = hits + misses;
            return total == 0 ? 0 : (double) hits / total;
        }
    }

}
```

---

## Файл: `src\main\java\com\strollie\route\client\GisApiClient.java`

```java
package com.strollie.route.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strollie.route.cache.CityRegionCache;
import com.strollie.route.config.ApiKeysConfig;
import com.strollie.route.model.dto.PlaceDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class GisApiClient {

    private static final String ITEMS_ENDPOINT = "/3.0/items";
    private static final int MAX_PAGE_SIZE = 10;

    private static final String EXTENDED_FIELDS = String.join(",",
            "items.point",
            "items.rubrics",
            "items.reviews",
            "items.schedule",
            "items.address",
            "items.description",
            "items.external_content"
    );

    private final WebClient webClient;
    private final ApiKeysConfig config;
    private final CityRegionCache cityCache;
    private final ObjectMapper mapper = new ObjectMapper();

    public List<PlaceDto> searchPlaces(String city, List<String> categoryNames,
                                       double lat, double lon, int radiusMeters, int totalPageSize) {

        log.info(">>> SEARCH: City='{}', Categories={}, Radius={}, Limit={}",
                city, categoryNames, radiusMeters, totalPageSize);

        // ВАЖНО: При нескольких категориях ВСЕГДА используем balanced search,
        // чтобы гарантировать представительность каждой категории в результатах.
        // Иначе API вернет только самые популярные места (обычно рестораны).
        if (categoryNames != null && categoryNames.size() > 1) {
            log.info(">>> Using BALANCED search for {} categories to ensure diversity",
                    categoryNames.size());
            return searchPlacesBalanced(city, categoryNames, lat, lon, radiusMeters, totalPageSize);
        }

        // Одна категория или без категорий — простой поиск
        try {
            String textQuery = buildTextQuery(city, categoryNames);
            int actualLimit = Math.min(totalPageSize, MAX_PAGE_SIZE);

            String itemsUrl = UriComponentsBuilder.newInstance()
                    .scheme("https")
                    .host(extractHost(config.getGis().getBaseUrl()))
                    .path(ITEMS_ENDPOINT)
                    .queryParam("q", textQuery)
                    .queryParam("point", lon + "," + lat)
                    .queryParam("radius", radiusMeters)
                    .queryParam("sort", "rating")
                    .queryParam("sort_point", lon + "," + lat)
                    .queryParam("type", "branch")
                    .queryParam("page_size", actualLimit)
                    .queryParam("fields", EXTENDED_FIELDS)
                    .queryParam("key", apiKey())
                    .build()
                    .toUriString();

            log.info(">>> REQUEST: {}", sanitizeUrl(itemsUrl));

            String responseBody = webClient.get()
                    .uri(itemsUrl)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info(">>> RAW RESPONSE (first 1000 chars): {}",
                    responseBody != null ? responseBody.substring(0, Math.min(1000, responseBody.length())) : "null");

            return parseItemsResponse(responseBody);

        } catch (Exception e) {
            log.error("Error during search. City: {}, Error: {}", city, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    public List<PlaceDto> searchPlacesBalanced(String city, List<String> categoryNames,
                                               double lat, double lon, int radiusMeters, int totalLimit) {

        if (categoryNames == null || categoryNames.isEmpty()) {
            return Collections.emptyList();
        }

        // Распределяем лимит по категориям, но не больше MAX_PAGE_SIZE на категорию
        int limitPerCategory = Math.min(MAX_PAGE_SIZE, Math.max(3, totalLimit / categoryNames.size()));
        log.info(">>> Balanced search: {} categories, {} items per category",
                categoryNames.size(), limitPerCategory);

        List<PlaceDto> allResults = new ArrayList<>();

        for (String category : categoryNames) {
            List<PlaceDto> categoryResults = searchSingleCategory(
                    city, category, lat, lon, radiusMeters, limitPerCategory);
            allResults.addAll(categoryResults);
        }

        return allResults.stream()
                .filter(p -> p.getId() != null)
                .distinct()
                .limit(totalLimit)
                .toList();
    }

    private List<PlaceDto> searchSingleCategory(String city, String category,
                                                double lat, double lon, int radiusMeters, int limit) {
        try {
            String textQuery = city + " " + category;
            int actualLimit = Math.min(limit, MAX_PAGE_SIZE);

            String itemsUrl = UriComponentsBuilder.newInstance()
                    .scheme("https")
                    .host(extractHost(config.getGis().getBaseUrl()))
                    .path(ITEMS_ENDPOINT)
                    .queryParam("q", textQuery)
                    .queryParam("point", lon + "," + lat)
                    .queryParam("radius", radiusMeters)
                    .queryParam("sort", "rating")
                    .queryParam("type", "branch")
                    .queryParam("page_size", actualLimit)
                    .queryParam("fields", EXTENDED_FIELDS)
                    .queryParam("key", apiKey())
                    .build()
                    .toUriString();

            log.info(">>> Category '{}' request: {}", category, sanitizeUrl(itemsUrl));

            String responseBody = webClient.get()
                    .uri(itemsUrl)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info(">>> Category '{}' response (first 500 chars): {}", category,
                    responseBody != null ? responseBody.substring(0, Math.min(500, responseBody.length())) : "null");

            List<PlaceDto> results = parseItemsResponse(responseBody);
            log.info(">>> Category '{}' found {} places", category, results.size());
            return results;

        } catch (Exception e) {
            log.warn("Failed to search category '{}': {}", category, e.getMessage());
            return Collections.emptyList();
        }
    }

    private String buildTextQuery(String city, List<String> categories) {
        if (categories == null || categories.isEmpty()) {
            return city;
        }
        return city + " " + String.join(" ", categories);
    }

    private List<PlaceDto> parseItemsResponse(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            log.warn(">>> PARSE: Response body is null or blank");
            return Collections.emptyList();
        }

        try {
            JsonNode root = mapper.readTree(responseBody);

            JsonNode meta = root.path("meta");
            int code = meta.path("code").asInt(0);
            log.info(">>> PARSE: Response code={}", code);

            if (code != 200) {
                JsonNode error = meta.path("error");
                log.error(">>> PARSE: API error - type={}, message={}",
                        error.path("type").asText(), error.path("message").asText());
                return Collections.emptyList();
            }

            JsonNode result = root.path("result");
            int total = result.path("total").asInt(0);
            log.info(">>> PARSE: Total results from API = {}", total);

            JsonNode items = result.path("items");

            if (items.isMissingNode() || !items.isArray()) {
                log.warn(">>> PARSE: Items missing or not array");
                return Collections.emptyList();
            }

            log.info(">>> PARSE: Items array size = {}", items.size());

            List<PlaceDto> places = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();

            for (JsonNode item : items) {
                PlaceDto place = mapToPlaceDto(item, now);
                if (place != null) {
                    places.add(place);
                }
            }

            log.info(">>> Parsed {} places from response", places.size());
            return places;

        } catch (Exception e) {
            log.error("Failed to parse items response: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private PlaceDto mapToPlaceDto(JsonNode item, LocalDateTime now) {
        PlaceDto dto = new PlaceDto();

        dto.setId(item.path("id").asText(null));
        dto.setName(item.path("name").asText(null));

        JsonNode point = item.path("point");
        if (!point.isMissingNode()) {
            dto.setLat(point.path("lat").asDouble());
            dto.setLon(point.path("lon").asDouble());
        }

        JsonNode rubrics = item.path("rubrics");
        if (rubrics.isArray() && !rubrics.isEmpty()) {
            dto.setCategory(rubrics.get(0).path("name").asText(null));
        }

        dto.setAddress(item.path("address_name").asText(null));
        dto.setDescription(item.path("description").asText(null));

        JsonNode reviews = item.path("reviews");
        if (!reviews.isMissingNode()) {
            String ratingStr = reviews.path("rating").asText(null);
            if (ratingStr != null && !ratingStr.isEmpty()) {
                try {
                    dto.setRating(Double.parseDouble(ratingStr));
                } catch (NumberFormatException ignored) {
                }
            }
            dto.setReviewCount(reviews.path("review_count").asInt(0));
        }

        JsonNode schedule = item.path("schedule");
        if (!schedule.isMissingNode()) {
            dto.setWorkingHours(formatSchedule(schedule));
            dto.setOpenNow(checkIfOpen(schedule, now));
        }

        JsonNode externalContent = item.path("external_content");
        if (externalContent.isArray() && !externalContent.isEmpty()) {
            for (JsonNode content : externalContent) {
                String photoUrl = content.path("main_photo_url").asText(null);
                if (photoUrl != null) {
                    dto.setPhotoUrl(photoUrl);
                    break;
                }
            }
        }

        return dto;
    }

    private String formatSchedule(JsonNode schedule) {
        if (schedule.path("is_24x7").asBoolean(false)) {
            return "Круглосуточно";
        }

        StringBuilder sb = new StringBuilder();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        String[] daysRu = {"Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"};

        for (int i = 0; i < days.length; i++) {
            JsonNode daySchedule = schedule.path(days[i]);
            if (!daySchedule.isMissingNode()) {
                JsonNode workingHours = daySchedule.path("working_hours");
                if (workingHours.isArray() && !workingHours.isEmpty()) {
                    JsonNode hours = workingHours.get(0);
                    String from = hours.path("from").asText("");
                    String to = hours.path("to").asText("");
                    if (!from.isEmpty() && !to.isEmpty()) {
                        if (!sb.isEmpty()) sb.append(", ");
                        sb.append(daysRu[i]).append(": ").append(from).append("-").append(to);
                    }
                }
            }
        }

        return sb.isEmpty() ? null : sb.toString();
    }

    private boolean checkIfOpen(JsonNode schedule, LocalDateTime now) {
        if (schedule.path("is_24x7").asBoolean(false)) {
            return true;
        }

        String dayName = now.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
        dayName = dayName.substring(0, 1).toUpperCase() + dayName.substring(1, 3).toLowerCase();

        JsonNode daySchedule = schedule.path(dayName);
        if (daySchedule.isMissingNode()) {
            return false;
        }

        JsonNode workingHours = daySchedule.path("working_hours");
        if (!workingHours.isArray() || workingHours.isEmpty()) {
            return false;
        }

        LocalTime currentTime = now.toLocalTime();
        for (JsonNode hours : workingHours) {
            String fromStr = hours.path("from").asText("");
            String toStr = hours.path("to").asText("");

            if (!fromStr.isEmpty() && !toStr.isEmpty()) {
                try {
                    LocalTime from = LocalTime.parse(fromStr);
                    LocalTime to = LocalTime.parse(toStr);

                    if (!currentTime.isBefore(from) && !currentTime.isAfter(to)) {
                        return true;
                    }
                } catch (Exception ignored) {
                }
            }
        }

        return false;
    }

    private String extractHost(String url) {
        if (url == null) return "catalog.api.2gis.com";
        return url.replace("https://", "").replace("http://", "").split("/")[0];
    }

    private String sanitizeUrl(String url) {
        return url == null ? null : url.replaceAll("(key=)[^&]+", "$1***");
    }

    private String apiKey() {
        return Optional.ofNullable(config.getGis())
                .map(ApiKeysConfig.Gis::getKey)
                .map(String::trim)
                .orElse("");
    }

}
```

---

## Файл: `src\main\java\com\strollie\route\client\LlmApiClient.java`

```java
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
```

---

## Файл: `src\main\java\com\strollie\route\config\ApiKeysConfig.java`

```java
package com.strollie.route.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Slf4j
@Configuration
@ConfigurationProperties(prefix = "api")
public class ApiKeysConfig {
    private Gis gis;
    private Llm llm;

    @Data
    public static class Gis {
        private String baseUrl;
        private String key;
        private int timeout;
        private int maxPlacesPerCategory;
    }

    @Data
    public static class Llm {
        private String provider;
        private String baseUrl;
        private String key;
        private String model;
        private int maxTokens;
        private int timeout;
    }

    @PostConstruct
    public void validate() {
        if (gis == null || gis.getKey() == null || gis.getKey().trim().isEmpty()) {
            log.error("GIS API key is missing!"); // Лог перед падением
            throw new IllegalStateException("GIS API key is not configured");
        }

        // Маскировка ключей
        String maskedGisKey = maskKey(gis.getKey());
        String maskedLlmKey = llm != null ? maskKey(llm.getKey()) : "<none>";

        log.info("==== Loaded API Configuration ====");
        log.info("GIS:");
        log.info("  baseUrl: {}", gis.getBaseUrl());
        log.info("  key: {}", maskedGisKey);
        log.info("  timeout: {}", gis.getTimeout());
        log.info("  maxPlacesPerCategory: {}", gis.getMaxPlacesPerCategory());

        if (llm != null) {
            log.info("LLM:");
            log.info("  provider: {}", llm.getProvider());
            log.info("  baseUrl: {}", llm.getBaseUrl());
            log.info("  key: {}", maskedLlmKey);
            log.info("  model: {}", llm.getModel());
            log.info("  maxTokens: {}", llm.getMaxTokens());
            log.info("  timeout: {}", llm.getTimeout());
        } else {
            log.warn("LLM config not provided");
        }

        log.info("==== API Configuration Loaded Successfully ====");
    }

    private String maskKey(String key) {
        if (key == null || key.length() <= 4) return "****";
        return key.substring(0, 4) + "****";
    }

}

```

---

## Файл: `src\main\java\com\strollie\route\config\CacheConfig.java`

```java
package com.strollie.route.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        return new CaffeineCacheManager();
    }
}
```

---

## Файл: `src\main\java\com\strollie\route\config\JacksonConfig.java`

```java
package com.strollie.route.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }

}
```

---

## Файл: `src\main\java\com\strollie\route\config\SwaggerConfig.java`

```java
package com.strollie.route.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Strollie Route Service API")
                        .description("Генерация туристических маршрутов на основе 2GIS, LLM и OpenRoute")
                        .version("0.1.0")
                        .license(new License().name("MIT"))
                );
    }
}
```

---

## Файл: `src\main\java\com\strollie\route\config\WebClientConfig.java`

```java
package com.strollie.route.config;

import io.netty.channel.ChannelOption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {
    @Bean
    public WebClient webClient(@Autowired ApiKeysConfig config) {
        int connectTimeout = Math.max(5000,
                Math.max(
                        config.getGis() != null ? config.getGis().getTimeout() : 0,
                        config.getLlm() != null ? config.getLlm().getTimeout() : 0
                )
        );

        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofMillis(connectTimeout))
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, connectTimeout);

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}

```

---

## Файл: `src\main\java\com\strollie\route\model\dto\CategoryDto.java`

```java
package com.strollie.route.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CategoryDto {

    @JsonProperty("category")
    private String name;

    @JsonProperty("id")
    private String id;

}

```

---

## Файл: `src\main\java\com\strollie\route\model\dto\PlaceDto.java`

```java
package com.strollie.route.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceDto {
    private String id;
    private String name;
    private String category;
    private double lat;
    private double lon;
    private String description;

    private String address;
    private Double rating;
    private Integer reviewCount;
    private String workingHours;
    private boolean openNow;
    private String photoUrl;
}
```

---

## Файл: `src\main\java\com\strollie\route\model\dto\RouteRequest.java`

```java
package com.strollie.route.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteRequest {
    @NotBlank
    private String city;
    @Size(min = 1)
    private List<String> categories;
    @NotBlank
    private String description;
    @NotNull
    private Integer durationHours;
    @NotNull
    private Point startPoint;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Point {
        @NotNull
        private Double lat;
        @NotNull
        private Double lon;
    }
}
```

---

## Файл: `src\main\java\com\strollie\route\model\dto\RouteResponse.java`

```java
package com.strollie.route.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {

    private List<PlaceDto> places;

    private String directionsUrl;

    private String description;

}
```

---

## Файл: `src\main\java\com\strollie\route\model\dto\RouteSegment.java`

```java
package com.strollie.route.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteSegment {
    private double fromLon;
    private double fromLat;
    private double toLon;
    private double toLat;
    private double distance;
    private double duration;
}
```

---

## Файл: `src\main\java\com\strollie\route\model\external\gis\GisItemsResponse.java`

```java
package com.strollie.route.model.external.gis;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GisItemsResponse {
    private Result result;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        private List<Item> items;
        private Integer total;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        private String id;
        private String name;
        private String type;

        private Point point;

        private List<Rubric> rubrics;

        @JsonProperty("address_name")
        private String addressName;

        @JsonProperty("full_address_name")
        private String fullAddressName;

        private String description;

        private Reviews reviews;

        private Schedule schedule;

        @JsonProperty("external_content")
        private List<ExternalContent> externalContent;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Point {
        private double lat;
        private double lon;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Rubric {
        private String id;
        private String name;
        @JsonProperty("short_name")
        private String shortName;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Reviews {
        private String rating;

        @JsonProperty("review_count")
        private String reviewCount;

        @JsonProperty("general_rating")
        private String generalRating;

        @JsonProperty("recommendation_count")
        private String recommendationCount;

        @JsonProperty("is_reviewable")
        private Boolean isReviewable;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Schedule {
        @JsonProperty("is_24x7")
        private Boolean is24x7;

        private String comment;

        @JsonProperty("Mon")
        private DaySchedule mon;

        @JsonProperty("Tue")
        private DaySchedule tue;

        @JsonProperty("Wed")
        private DaySchedule wed;

        @JsonProperty("Thu")
        private DaySchedule thu;

        @JsonProperty("Fri")
        private DaySchedule fri;

        @JsonProperty("Sat")
        private DaySchedule sat;

        @JsonProperty("Sun")
        private DaySchedule sun;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DaySchedule {
        @JsonProperty("working_hours")
        private List<WorkingHours> workingHours;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WorkingHours {
        private String from;
        private String to;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ExternalContent {
        private String type;
        private String value;
        private String label;

        @JsonProperty("main_photo_url")
        private String mainPhotoUrl;

        private String url;
    }

}
```

---

## Файл: `src\main\java\com\strollie\route\model\external\gis\GisRegionSearchResponse.java`

```java
package com.strollie.route.model.external.gis;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GisRegionSearchResponse {
    private Result result;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        private List<Item> items;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        private String id;
    }
}

```

---

## Файл: `src\main\java\com\strollie\route\model\external\gis\GisRubricSearchResponse.java`

```java
package com.strollie.route.model.external.gis;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GisRubricSearchResponse {
    private Result result;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        private List<Item> items;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        private String id;
        private String name;
        @JsonProperty("branch_count")
        private int branchCount;
    }
}

```

---

## Файл: `src\main\java\com\strollie\route\model\external\llm\ChatCompletionRequest.java`

```java
package com.strollie.route.model.external.llm;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatCompletionRequest {
    private String model;
    private List<Message> messages;
    private Integer max_tokens;
    private Double temperature;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}
```

---

## Файл: `src\main\java\com\strollie\route\model\external\llm\ChatCompletionResponse.java`

```java
package com.strollie.route.model.external.llm;

import lombok.Data;

import java.util.List;

@Data
public class ChatCompletionResponse {
    private List<Choice> choices;

    @Data
    public static class Choice {
        private Message message;
    }

    @Data
    public static class Message {
        private String role;
        private String content;
    }
}
```

---

## Файл: `src\main\java\com\strollie\route\service\CategoryCacheService.java`

```java
package com.strollie.route.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strollie.route.model.dto.CategoryDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryCacheService {

    @Value("classpath:categories.json")
    private Resource resourceFile;

    private final ObjectMapper objectMapper;

    private List<CategoryDto> categories = new ArrayList<>();

    @PostConstruct
    public void init() {
        log.info("Загрузка категорий из файла: {}", resourceFile.getFilename());

        try {
            if (!resourceFile.exists()) {
                log.error("Файл категорий не найден: {}", resourceFile.getDescription());
                throw new RuntimeException("Файл categories.json не найден");
            }

            categories = objectMapper.readValue(resourceFile.getInputStream(), new TypeReference<List<CategoryDto>>() {
            });

            log.info("Категории успешно загружены. Количество записей: {}", categories.size());

        } catch (IOException e) {
            log.error("Ошибка при чтении файла категорий JSON", e);
            throw new RuntimeException("Не удалось инициализировать кэш категорий", e);
        }
    }

    public List<CategoryDto> getAllCategories() {
        return categories;
    }

    public String getCategoryNameById(String id) {
        log.debug("Поиск названия категории по ID: {}", id);

        return categories.stream().filter(c -> c.getId().equals(id)).findFirst().map(CategoryDto::getName).orElseGet(() -> {
            log.warn("Категория с ID {} не найдена", id); // WARN если ID пришел, но его нет в базе
            return null;
        });
    }
}
```

---

## Файл: `src\main\java\com\strollie\route\service\CategoryEnricherService.java`

```java
package com.strollie.route.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strollie.route.config.ApiKeysConfig;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

/**
 * Сервис для интеллектуального расширения категорий поиска на основе запроса пользователя.
 * <p>
 * Анализирует текстовое описание и предлагает дополнительные релевантные категории
 * для более полного покрытия интересов пользователя.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryEnricherService {

    private final WebClient webClient;
    private final ApiKeysConfig config;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final int MAX_CATEGORIES = 8;
    private static final int MAX_ADDED_CATEGORIES = 4;

    /**
     * Расширяет список категорий на основе описания пользователя.
     *
     * @param originalCategories исходные категории из запроса
     * @param userDescription    текстовое описание пожеланий пользователя
     * @param city               город для контекста
     * @return расширенный список категорий (исходные + предложенные LLM)
     */
    public List<String> enrichCategories(List<String> originalCategories, String userDescription, String city) {
        if (userDescription == null || userDescription.isBlank()) {
            log.info(">>> CATEGORY ENRICHER: No description provided, using original categories");
            return originalCategories;
        }

        log.info(">>> CATEGORY ENRICHER: Analyzing description: '{}'", userDescription);
        log.info(">>> CATEGORY ENRICHER: Original categories: {}", originalCategories);

        try {
            String prompt = buildPrompt(originalCategories, userDescription, city);
            String llmResponse = callLlm(prompt);

            if (llmResponse == null || llmResponse.isBlank()) {
                log.warn(">>> CATEGORY ENRICHER: Empty LLM response, using original categories");
                return originalCategories;
            }

            log.info(">>> CATEGORY ENRICHER: Raw LLM response: {}", llmResponse);

            List<String> suggestedCategories = parseResponse(llmResponse);
            List<String> enrichedCategories = mergeCategories(originalCategories, suggestedCategories);

            log.info(">>> CATEGORY ENRICHER: Enriched categories: {}", enrichedCategories);
            return enrichedCategories;

        } catch (Exception e) {
            log.error(">>> CATEGORY ENRICHER: Error during enrichment: {}", e.getMessage());
            return originalCategories;
        }
    }

    private String buildPrompt(List<String> categories, String description, String city) {
        return String.format("""
                        Ты помощник для планирования прогулок. Проанализируй запрос пользователя и предложи дополнительные категории мест для поиска.
                        
                        Город: %s
                        Текущие категории: %s
                        Запрос пользователя: "%s"
                        
                        Задача: Предложи 0-4 ДОПОЛНИТЕЛЬНЫЕ категории, которые могут быть интересны пользователю, исходя из его запроса.
                        
                        Правила:
                        - НЕ повторяй уже имеющиеся категории
                        - Предлагай только релевантные запросу категории
                        - Используй простые названия категорий на русском (как в 2GIS): кафе, парки, памятники, галереи, театры, церкви, скверы и т.д.
                        - Если запрос уже хорошо покрыт текущими категориями, верни пустой список
                        - Максимум 4 новые категории
                        
                        Ответь ТОЛЬКО JSON в формате:
                        {"categories": ["категория1", "категория2"]}
                        
                        Если новые категории не нужны:
                        {"categories": []}
                        """,
                city,
                String.join(", ", categories),
                description
        );
    }

    private String callLlm(String prompt) {
        try {
            // JSON Schema для структурированного ответа
            Map<String, Object> jsonSchema = Map.of(
                    "name", "category_response",
                    "strict", true,
                    "schema", Map.of(
                            "type", "object",
                            "properties", Map.of(
                                    "categories", Map.of(
                                            "type", "array",
                                            "items", Map.of("type", "string"),
                                            "description", "Список дополнительных категорий для поиска"
                                    )
                            ),
                            "required", List.of("categories"),
                            "additionalProperties", false
                    )
            );

            Map<String, Object> request = Map.of(
                    "model", config.getLlm().getModel(),
                    "max_tokens", 200,
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
            // Structured output гарантирует валидный JSON, просто парсим
            CategoryResponse parsed = objectMapper.readValue(response, CategoryResponse.class);

            if (parsed.getCategories() != null) {
                return parsed.getCategories().stream()
                        .filter(c -> c != null && !c.isBlank())
                        .map(String::toLowerCase)
                        .map(String::trim)
                        .limit(MAX_ADDED_CATEGORIES)
                        .toList();
            }
        } catch (Exception e) {
            log.warn(">>> CATEGORY ENRICHER: Failed to parse response: {}", e.getMessage());
        }
        return List.of();
    }

    private List<String> mergeCategories(List<String> original, List<String> suggested) {
        Set<String> seen = new HashSet<>();
        List<String> result = new ArrayList<>();

        // Сначала добавляем оригинальные
        for (String cat : original) {
            String normalized = cat.toLowerCase().trim();
            if (seen.add(normalized)) {
                result.add(cat);
            }
        }

        // Добавляем новые, если есть место
        for (String cat : suggested) {
            if (result.size() >= MAX_CATEGORIES) {
                break;
            }
            String normalized = cat.toLowerCase().trim();
            if (seen.add(normalized)) {
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
```

---

## Файл: `src\main\java\com\strollie\route\service\GisPlaceService.java`

```java
package com.strollie.route.service;

import com.strollie.route.client.GisApiClient;
import com.strollie.route.config.ApiKeysConfig;
import com.strollie.route.model.dto.PlaceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GisPlaceService {

    private final GisApiClient gisApiClient;
    private final ApiKeysConfig config;

    public List<PlaceDto> findPlacesByCategories(String city, List<String> categories, double lat, double lon, int radius) {
        int pageSize = config.getGis().getMaxPlacesPerCategory();

        return gisApiClient.searchPlaces(
                city,
                categories,
                lat,
                lon,
                radius,
                pageSize 
        );
    }
}
```

---

## Файл: `src\main\java\com\strollie\route\service\LlmFilterService.java`

```java
package com.strollie.route.service;

import com.strollie.route.client.LlmApiClient;
import com.strollie.route.model.dto.PlaceDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LlmFilterService {

    private final LlmApiClient llmApiClient;

    public LlmFilterService(LlmApiClient llmApiClient) {
        this.llmApiClient = llmApiClient;
    }

    public List<PlaceDto> filterAndRankPlaces(List<PlaceDto> places, String userDescription, int durationHours) {
        return llmApiClient.filterPlaces(places, userDescription, durationHours);
    }

}
```

---

## Файл: `src\main\java\com\strollie\route\service\RouteOrchestrationService.java`

```java
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

    private final GisApiClient gisApiClient;
    private final CategoryEnricherService categoryEnricherService;
    private final LlmFilterService llmFilterService;
    private final LlmApiClient llmApiClient;
    private final TspSolverService tspSolverService;

    private static final int DEFAULT_RADIUS_METERS = 3000;

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
```

---

## Файл: `src\main\java\com\strollie\route\service\TspSolverService.java`

```java
package com.strollie.route.service;

import com.strollie.route.model.dto.PlaceDto;
import org.springframework.stereotype.Service;

import java.util.*;

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
```

---

## Файл: `src\main\java\com\strollie\route\util\DirectionsLinkBuilder.java`

```java
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
```

---

## Файл: `src\main\java\com\strollie\route\web\CategoryController.java`

```java
package com.strollie.route.web;

import com.strollie.route.model.dto.CategoryDto;
import com.strollie.route.service.CategoryCacheService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryCacheService categoryService;

    @GetMapping
    public List<CategoryDto> getCategories() {
        return categoryService.getAllCategories();
    }

}
```

---

## Файл: `src\main\java\com\strollie\route\web\RouteController.java`

```java
package com.strollie.route.web;

import com.strollie.route.model.dto.RouteRequest;
import com.strollie.route.model.dto.RouteResponse;
import com.strollie.route.service.RouteOrchestrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    @Operation(summary = "Генерация туристического маршрута")
    public ResponseEntity<RouteResponse> generateRoute(@Valid @RequestBody RouteRequest request) {
        return ResponseEntity.ok(orchestrationService.generateRoute(request));
    }

}
```

---

## Файл: `src\main\resources\application.yaml`

```yaml
server:
  port: 8082

spring:
  application:
    name: route-service
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=1000,expireAfterWrite=24h

api:
  gis:
    base-url: https://catalog.api.2gis.com
    key: e1270ba5-84c8-4ca1-9ac5-00fca2286431
    timeout: 5000
    max-places-per-category: 10
  llm:
    provider: openrouter
    base-url: https://openrouter.ai/api/v1
    key: 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
    model: openai/gpt-oss-20b:free
    max-tokens: 10000
    timeout: 30000

routing:
  default-radius-meters: 5000
  min-places: 3
  max-places: 10
  max-route-duration-hours: 5

springdoc:
  api-docs:
    enabled: true
  swagger-ui:
    path: /swagger-ui

logging:
  level:
    com.strollie.route.client: INFO

```

---

