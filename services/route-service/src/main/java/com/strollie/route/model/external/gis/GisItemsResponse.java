package com.strollie.route.model.external.gis;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        private String id;
        private String name;
        private Point point;
        private List<Rubric> rubrics;
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
    }
}
