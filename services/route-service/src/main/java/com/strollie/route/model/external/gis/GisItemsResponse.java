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