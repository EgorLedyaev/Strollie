package com.strollie.route.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "api")
@Data
public class ApiKeysConfig {
    private Gis gis;
    private Openroute openroute;
    private Llm llm;

    @Data
    public static class Gis {
        private String baseUrl;
        private String key;
        private int timeout;
        private int maxPlacesPerCategory;
    }

    @Data
    public static class Openroute {
        private String baseUrl;
        private String key;
        private int timeout;
        private String profile;
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
}