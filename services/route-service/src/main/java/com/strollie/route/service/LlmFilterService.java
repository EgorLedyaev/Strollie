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