package com.strollie.route.client;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strollie.route.config.ApiKeysConfig;
import com.strollie.route.model.dto.PlaceDto;
import com.strollie.route.model.external.llm.ChatCompletionRequest;
import com.strollie.route.model.external.llm.ChatCompletionResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class LlmApiClient {
    private final WebClient webClient;
    private final ApiKeysConfig config;
    private final ObjectMapper mapper = new ObjectMapper();

    public LlmApiClient(WebClient webClient, ApiKeysConfig config) {
        this.webClient = webClient;
        this.config = config;
    }

    public List<PlaceDto> filterPlaces(List<PlaceDto> places, String userDescription, int durationHours) {
        String placesJson;
        try { placesJson = mapper.writeValueAsString(places); } catch (Exception e) { return places; }
        String prompt = "Выбери 5-8 наиболее подходящих мест для маршрута.\n" +
                "Описание маршрута: " + userDescription + "\n" +
                "Длительность: " + durationHours + " часов\n" +
                "Доступные места (JSON):\n" + placesJson + "\n" +
                "Верни только JSON массив: [{\"placeId\": \"...\", \"reason\": \"...\"}]";

        ChatCompletionRequest req = new ChatCompletionRequest();
        req.setModel(config.getLlm().getModel());
        req.setMax_tokens(config.getLlm().getMaxTokens());
        List<ChatCompletionRequest.Message> msgs = new ArrayList<>();
        msgs.add(new ChatCompletionRequest.Message("system", "Ты помощник по выбору туристических мест. Возвращай только валидный JSON без текста."));
        msgs.add(new ChatCompletionRequest.Message("user", prompt));
        req.setMessages(msgs);

        try {
            WebClient wc = webClient.mutate().baseUrl(config.getLlm().getBaseUrl()).build();
            ChatCompletionResponse resp = wc.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + config.getLlm().getKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(req)
                    .retrieve()
                    .bodyToMono(ChatCompletionResponse.class)
                    .block();

            if (resp == null || resp.getChoices() == null || resp.getChoices().isEmpty()) return places;
            String content = resp.getChoices().get(0).getMessage().getContent();
            List<Selected> selected = mapper.readValue(content, new TypeReference<List<Selected>>(){});
            Set<String> ids = selected.stream().map(s -> s.placeId).collect(Collectors.toCollection(HashSet::new));
            return places.stream().filter(p -> ids.contains(p.getId())).collect(Collectors.toList());
        } catch (Exception e) {
            return places;
        }
    }

    public static class Selected {
        public String placeId;
        public String reason;
    }
}