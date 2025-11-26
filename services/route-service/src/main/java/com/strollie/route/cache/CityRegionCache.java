package com.strollie.route.cache;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class CityRegionCache {
    private final Map<String, String> cities = new ConcurrentHashMap<>();

    public String get(String city) { return cities.get(city); }
    public void put(String city, String id) { cities.put(city, id); }
}