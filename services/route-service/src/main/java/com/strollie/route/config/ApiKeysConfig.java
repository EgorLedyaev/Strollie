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
