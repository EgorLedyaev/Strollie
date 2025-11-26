package com.strollie.route.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.strollie.route.cache.CityRegionCache;
import com.strollie.route.config.ApiKeysConfig;
import com.strollie.route.model.dto.PlaceDto;
import com.strollie.route.model.external.gis.GisItemsResponse;
import com.strollie.route.model.external.gis.GisRegionSearchResponse;
import com.strollie.route.model.external.gis.GisRubricSearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class GisApiClient {

    private final WebClient webClient;
    private final ApiKeysConfig config;
    private final CityRegionCache cityCache;
    private final ObjectMapper mapper = new ObjectMapper();

    // Базовые пути вынесены в константы для удобства
    private static final String ITEMS_ENDPOINT = "/3.0/items";
    private static final String REGION_SEARCH_ENDPOINT = "/2.0/region/search";
    private static final String RUBRIC_SEARCH_ENDPOINT = "/2.0/catalog/rubric/search";

    public List<PlaceDto> searchPlaces(String city, List<String> categoryNames, double lat, double lon, int radiusMeters, int pageSize) {
        try {
            String cityId = resolveCityId(city);
            if (!StringUtils.hasText(cityId)) {
                log.warn("City ID not found for city: {}", city);
                return Collections.emptyList();
            }

            List<String> rubricIds = resolveRubricIds(categoryNames, cityId);
            if (rubricIds.isEmpty()) {
                log.info("No rubric IDs found for categories: {} in city: {}", categoryNames, city);
                return Collections.emptyList();
            }

            String rubricParam = String.join(",", rubricIds);
            
            String baseUrl = config.getGis().getBaseUrl();
            String itemsUrl = UriComponentsBuilder.newInstance()
                    .scheme("https")
                    .host(extractHost(baseUrl))
                    .path(ITEMS_ENDPOINT)
                    .queryParam("rubric_id", rubricParam)
                    .queryParam("city_id", cityId)
                    .queryParam("point", lon + "," + lat)
                    .queryParam("radius", radiusMeters)
                    .queryParam("page_size", pageSize)
                    .queryParam("fields", "items.point,items.rubrics")
                    .queryParam("key", apiKey())
                    .build()
                    .toUriString();

            log.info("2GIS ITEMS request: {}", sanitizeUrl(itemsUrl));

            GisItemsResponse response = webClient.get()
                    .uri(itemsUrl)
                    .accept(MediaType.APPLICATION_JSON)
                    .exchangeToMono(resp -> resp.bodyToMono(String.class)
                            .map(body -> {
                                log.info("2GIS ITEMS response status: {}", resp.statusCode());
                                log.info("2GIS ITEMS response body: {}", body);
                                try {
                                    return mapper.readValue(body, GisItemsResponse.class);
                                } catch (Exception ex) {
                                    log.error("Failed to parse ITEMS response: {}", ex.getMessage());
                                    return null;
                                }
                            }))
                    .block();

            if (response == null || response.getResult() == null || response.getResult().getItems() == null) {
                return Collections.emptyList();
            }

            return response.getResult().getItems().stream()
                    .map(this::mapToPlaceDto)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error during searchPlaces execution for city: {}, categories: {}. Error: {}", city, categoryNames, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    private PlaceDto mapToPlaceDto(GisItemsResponse.Item item) {
        PlaceDto dto = new PlaceDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        if (item.getPoint() != null) {
            dto.setLat(item.getPoint().getLat());
            dto.setLon(item.getPoint().getLon());
        }
        String category = (item.getRubrics() != null && !item.getRubrics().isEmpty()) 
                ? item.getRubrics().get(0).getName() 
                : null;
        dto.setCategory(category);
        return dto;
    }

    private String resolveCityId(String city) {
        String cached = cityCache.get(city);
        if (cached != null) return cached;

        try {
            String baseUrl = config.getGis().getBaseUrl();
            String regionUrl = UriComponentsBuilder.newInstance()
                    .scheme("https")
                    .host(extractHost(baseUrl))
                    .path(REGION_SEARCH_ENDPOINT)
                    .queryParam("q", city)
                    .queryParam("locale", "ru_RU")
                    .queryParam("key", apiKey())
                    .build()
                    .toUriString();

            log.info("2GIS REGION request: {}", sanitizeUrl(regionUrl));

            return webClient.get()
                    .uri(regionUrl)
                    .accept(MediaType.APPLICATION_JSON)
                    .exchangeToMono(resp -> resp.bodyToMono(String.class)
                            .map(body -> {
                                log.info("2GIS REGION response status: {}", resp.statusCode());
                                log.info("2GIS REGION response body: {}", body);
                                try {
                                    GisRegionSearchResponse gr = mapper.readValue(body, GisRegionSearchResponse.class);
                                    return gr;
                                } catch (Exception ex) {
                                    log.error("Failed to parse REGION response: {}", ex.getMessage());
                                    return null;
                                }
                            }))
                    .map(resp -> {
                        if (resp.getResult() != null && resp.getResult().getItems() != null && !resp.getResult().getItems().isEmpty()) {
                            String id = resp.getResult().getItems().get(0).getId();
                            cityCache.put(city, id);
                            return id;
                        }
                        return ""; // Возвращаем пустую строку, если не нашли
                    })
                    .block();
        } catch (Exception e) {
            log.error("Failed to resolve city ID for: {}. Error: {}", city, e.getMessage(), e);
            return null;
        }
    }

    private List<String> resolveRubricIds(List<String> categories, String regionId) {
        if (categories == null || categories.isEmpty()) return Collections.emptyList();

        try {
            // ОПТИМИЗАЦИЯ: Запускаем поиск всех рубрик параллельно (flatMap)
            return Flux.fromIterable(categories)
                    .flatMap(cat -> {
                        String rubricUrl = UriComponentsBuilder.newInstance()
                                .scheme("https")
                                .host(extractHost(config.getGis().getBaseUrl()))
                                .path(RUBRIC_SEARCH_ENDPOINT)
                                .queryParam("q", cat)
                                .queryParam("region_id", regionId)
                                .queryParam("locale", "ru_RU")
                                .queryParam("key", apiKey())
                                .build()
                                .toUriString();

                        log.info("2GIS RUBRIC request ({}): {}", cat, sanitizeUrl(rubricUrl));

                        return webClient.get()
                                .uri(rubricUrl)
                                .accept(MediaType.APPLICATION_JSON)
                                .exchangeToMono(resp -> resp.bodyToMono(String.class)
                                        .map(body -> {
                                            log.info("2GIS RUBRIC response status ({}): {}", cat, resp.statusCode());
                                            log.info("2GIS RUBRIC response body ({}): {}", cat, body);
                                            try {
                                                return mapper.readValue(body, GisRubricSearchResponse.class);
                                            } catch (Exception ex) {
                                                log.error("Failed to parse RUBRIC response ({}): {}", cat, ex.getMessage());
                                                return null;
                                            }
                                        }))
                                .onErrorResume(e -> {
                                    log.error("Error fetching rubric for category: {}. Error: {}", cat, e.getMessage());
                                    return Mono.empty();
                                });
                    })
                    .map(resp -> {
                        if (resp.getResult() != null && resp.getResult().getItems() != null && !resp.getResult().getItems().isEmpty()) {
                            return resp.getResult().getItems().get(0).getId();
                        }
                        return null;
                    })
                    .filter(Objects::nonNull)
                    .collectList()
                    .block(); // Блокируем только в самом конце, когда собрали все результаты
        } catch (Exception e) {
            log.error("Critical error resolving rubric IDs. Error: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
    
    // Вспомогательный метод, если baseUrl приходит с http/https (WebClient uriBuilder иногда капризен при смешивании)
    private String extractHost(String url) {
        if (url == null) return "catalog.api.2gis.com"; // Fallback
        return url.replace("https://", "")
        .replace("http://", "")
        .split("/")[0];
    }

    private String sanitizeUrl(String url) {
        return url == null ? null : url.replaceAll("(key=)[^&]+", "$1***");
    }

    private String apiKey() {
        String k = Optional.ofNullable(config.getGis()).map(ApiKeysConfig.Gis::getKey).orElse("");
        return k == null ? "" : k.trim();
    }
}
