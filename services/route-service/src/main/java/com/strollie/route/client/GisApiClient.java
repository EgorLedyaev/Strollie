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
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class GisApiClient {

    private static final String ITEMS_ENDPOINT = "/3.0/items";
    private static final String REGION_SEARCH_ENDPOINT = "/2.0/region/search";
    private static final String RUBRIC_SEARCH_ENDPOINT = "/2.0/catalog/rubric/search";

    private final WebClient webClient;
    private final ApiKeysConfig config;
    private final CityRegionCache cityCache;
    private final ObjectMapper mapper = new ObjectMapper();

    public List<PlaceDto> searchPlaces(String city, List<String> categoryNames, double lat, double lon, int radiusMeters, int pageSize) {
        log.info(">>> START SEARCH: City='{}', Categories={}, Radius={}, PageSize={}", city, categoryNames, radiusMeters, pageSize);

        try {
            // 1. Получаем ID города
            String cityId = resolveCityId(city);
            if (!StringUtils.hasText(cityId)) {
                log.warn("!!! City ID not found for city: {}", city);
                return Collections.emptyList();
            }
            log.info(">>> RESOLVED CITY ID: {}", cityId);

            // 2. Получаем ID рубрик
            List<String> rubricIds = resolveRubricIds(categoryNames, cityId);
            if (rubricIds.isEmpty()) {
                log.info("!!! No rubric IDs found for categories: {} in city: {}", categoryNames, city);
                return Collections.emptyList();
            }
            log.info(">>> RESOLVED RUBRIC IDs: {}", rubricIds);

            String rubricParam = String.join(",", rubricIds);

            // 3. Формируем запрос на поиск мест
            String baseUrl = config.getGis().getBaseUrl();
            String itemsUrl = UriComponentsBuilder.newInstance()
                    .scheme("https")
                    .host(extractHost(baseUrl))
                    .path(ITEMS_ENDPOINT)
                    .queryParam("rubric_id", rubricParam)
                    // .queryParam("city_id", cityId) // Можно попробовать закомментировать, если поиск по радиусу не работает
                    .queryParam("point", lon + "," + lat)
                    .queryParam("radius", radiusMeters)
                    .queryParam("page_size", pageSize)
                    .queryParam("fields", "items.point,items.rubrics")
                    .queryParam("key", apiKey())
                    .build()
                    .toUriString();

            log.info(">>> ITEMS REQUEST URL: {}", sanitizeUrl(itemsUrl));

            GisItemsResponse response = webClient.get()
                    .uri(itemsUrl)
                    .accept(MediaType.APPLICATION_JSON)
                    .exchangeToMono(resp -> {
                        log.info(">>> ITEMS RESPONSE STATUS: {}", resp.statusCode());
                        return resp.bodyToMono(String.class)
                                .map(body -> {
                                    log.info(">>> ITEMS RAW BODY: {}", body); // ВЫВОДИМ ПОЛНЫЙ ОТВЕТ
                                    try {
                                        return mapper.readValue(body, GisItemsResponse.class);
                                    } catch (Exception ex) {
                                        log.error("!!! Failed to parse ITEMS response: {}", ex.getMessage());
                                        return null;
                                    }
                                });
                    })
                    .block();

            if (response == null || response.getResult() == null || response.getResult().getItems() == null) {
                log.warn("!!! Items result is empty or null");
                return Collections.emptyList();
            }

            log.info(">>> ITEMS FOUND COUNT: {}", response.getResult().getItems().size());

            return response.getResult().getItems().stream()
                    .map(this::mapToPlaceDto)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("!!! Error during searchPlaces execution. City: {}, Error: {}", city, e.getMessage(), e);
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
        if (cached != null) {
            log.info("City ID for '{}' found in cache: {}", city, cached);
            return cached;
        }

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

            log.info(">>> REGION REQUEST: {}", sanitizeUrl(regionUrl));

            return webClient.get()
                    .uri(regionUrl)
                    .accept(MediaType.APPLICATION_JSON)
                    .exchangeToMono(resp -> {
                        log.info(">>> REGION STATUS: {}", resp.statusCode());
                        return resp.bodyToMono(String.class)
                                .map(body -> {
                                    log.info(">>> REGION RAW BODY: {}", body);
                                    try {
                                        return mapper.readValue(body, GisRegionSearchResponse.class);
                                    } catch (Exception ex) {
                                        log.error("!!! Failed to parse REGION response: {}", ex.getMessage());
                                        return null;
                                    }
                                });
                    })
                    .map(resp -> {
                        if (resp.getResult() != null && resp.getResult().getItems() != null && !resp.getResult().getItems().isEmpty()) {
                            String id = resp.getResult().getItems().get(0).getId();
                            log.info("Resolved City ID: {}", id);
                            cityCache.put(city, id);
                            return id;
                        }
                        log.warn("!!! Region search returned empty items");
                        return "";
                    })
                    .block();
        } catch (Exception e) {
            log.error("!!! Failed to resolve city ID for: {}. Error: {}", city, e.getMessage(), e);
            return null;
        }
    }

    private List<String> resolveRubricIds(List<String> categories, String regionId) {
        if (categories == null || categories.isEmpty()) return Collections.emptyList();

        try {
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

                        log.info(">>> RUBRIC REQUEST [{}]: {}", cat, sanitizeUrl(rubricUrl));

                        return webClient.get()
                                .uri(rubricUrl)
                                .accept(MediaType.APPLICATION_JSON)
                                .exchangeToMono(resp -> {
                                    log.info(">>> RUBRIC STATUS [{}]: {}", cat, resp.statusCode());
                                    return resp.bodyToMono(String.class)
                                            .flatMap(body -> {
                                                // ЛОГИРУЕМ ТЕЛО, ЧТОБЫ ВИДЕТЬ branch_count
                                                log.info(">>> RUBRIC RAW BODY [{}]: {}", cat, body);
                                                try {
                                                    GisRubricSearchResponse parsed = mapper.readValue(body, GisRubricSearchResponse.class);
                                                    return Mono.justOrEmpty(parsed);
                                                } catch (Exception ex) {
                                                    log.error("!!! Failed to parse RUBRIC response [{}]: {}", cat, ex.getMessage());
                                                    return Mono.empty();
                                                }
                                            });
                                })
                                .onErrorResume(e -> {
                                    log.error("!!! Error fetching rubric [{}]: {}", cat, e.getMessage());
                                    return Mono.empty();
                                });
                    })
                    .flatMap(resp -> {
                        if (resp.getResult() != null && resp.getResult().getItems() != null && !resp.getResult().getItems().isEmpty()) {
                            // ЛОГИРУЕМ ВСЕ НАЙДЕННЫЕ ВАРИАНТЫ ДЛЯ КАТЕГОРИИ
                            log.info("--- Candidates for current category ---");
                            resp.getResult().getItems().forEach(item ->
                                            log.info("   -> Candidate: ID={}, Name='{}'", item.getId(), item.getName())
                                    // Если бы было поле branch_count в DTO, мы бы вывели его здесь: item.getBranchCount()
                            );

                            // Пока берем первый попавшийся (0), но в логах увидим, были ли другие
                            String selectedId = resp.getResult().getItems().get(0).getId();
                            String selectedName = resp.getResult().getItems().get(0).getName();

                            log.info(">>> SELECTED RUBRIC: ID={}, Name='{}'", selectedId, selectedName);
                            return Mono.just(selectedId);
                        }
                        log.warn("!!! No items found in rubric response");
                        return Mono.empty();
                    })
                    .collectList()
                    .block();
        } catch (Exception e) {
            log.error("!!! Critical error resolving rubric IDs. Error: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    private String extractHost(String url) {
        if (url == null) return "catalog.api.2gis.com";
        return url.replace("https://", "").replace("http://", "").split("/")[0];
    }

    private String sanitizeUrl(String url) {
        return url == null ? null : url.replaceAll("(key=)[^&]+", "$1***");
    }

    private String apiKey() {
        String k = Optional.ofNullable(config.getGis()).map(ApiKeysConfig.Gis::getKey).orElse("");
        return k == null ? "" : k.trim();
    }
}