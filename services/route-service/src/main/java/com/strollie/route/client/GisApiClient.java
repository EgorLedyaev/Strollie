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