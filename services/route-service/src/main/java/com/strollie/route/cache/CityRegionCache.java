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