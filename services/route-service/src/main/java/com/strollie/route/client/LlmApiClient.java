package com.strollie.route.client;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strollie.route.config.ApiKeysConfig;
import com.strollie.route.model.dto.PlaceDto;
import com.strollie.route.model.external.llm.ChatCompletionRequest;
import com.strollie.route.model.external.llm.ChatCompletionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Component
public class LlmApiClient {
    private final WebClient webClient;
    private final ApiKeysConfig config;
    private final ObjectMapper mapper = new ObjectMapper();

    private static final Pattern JSON_BLOCK_PATTERN = Pattern.compile("```(?:json)?\\s*(\\[.*])\\s*```", Pattern.DOTALL);

    public LlmApiClient(WebClient webClient, ApiKeysConfig config) {
        this.webClient = webClient;
        this.config = config;
    }

    public List<PlaceDto> filterPlaces(List<PlaceDto> places, String userDescription, int durationHours) {
        if (places.isEmpty()) return places;

        String placesJson;
        try {
            List<PlaceCompactDto> compactList = places.stream()
                    .map(p -> new PlaceCompactDto(p.getId(), p.getName(), p.getCategory()))
                    .collect(Collectors.toList());
            placesJson = mapper.writeValueAsString(compactList);
        } catch (Exception e) {
            log.error("Error serializing places for LLM", e);
            return places;
        }

        // Оптимальное количество мест
        int minPlaces = Math.max(2, durationHours / 2);
        int maxPlaces = Math.min(durationHours + 2, 7);

        // Проверка: просил ли пользователь еду?
        boolean isFoodRequested = userDescription.toLowerCase().matches(".*(еда|ужин|обед|завтрак|ресторан|кафе|перекус|поесть|голод).*");
        String foodInstruction = isFoodRequested
                ? "ПОЛЬЗОВАТЕЛЬ ПРОСИТ ЕДУ! Ты ОБЯЗАН включить в маршрут МИНИМУМ 1 заведение общественного питания, даже если они не идеальны."
                : "Если уместно, добавь 1 место для перекуса.";

        String prompt = String.format("""
                        Ты — опытный гид. Составь идеальный маршрут из предложенных кандидатов.
                        
                        ВХОДНЫЕ ДАННЫЕ:
                        1. Пожелание: "%s"
                        2. Время: %d ч.
                        3. Кандидаты (JSON):
                        %s
                        
                        ПРАВИЛА ОТБОРА:
                        1. КОЛИЧЕСТВО: Выбери от %d до %d мест.
                        2. БАЛАНС: Маршрут должен быть разнообразным (прогулка + культура + еда). Не выбирай 3 парка подряд или 3 музея подряд.
                        3. %s
                        4. ЕДА (ВАЖНО):
                           - Категории в данных могут врать (например, хороший ресторан может быть помечен как "Быстрое питание").
                           - СМОТРИ НА НАЗВАНИЕ!
                           - Если запрос романтический: Исключай ТОЛЬКО явный масс-маркет (Вкусно и точка, KFC, Burger King, Шаурма).
                           - Уютные бургерные, бистро или кофейни — ОСТАВЛЯЙ, если нет лучших альтернатив.
                           - В маршруте должно быть не более 2-х мест с едой (одно основное, одно — кофе/десерт).
                        
                        ФОРМАТ ОТВЕТА (JSON массив):
                        [{"placeId": "...", "reason": "..."}]
                        """,
                userDescription,
                durationHours,
                placesJson,
                minPlaces,
                maxPlaces,
                foodInstruction
        );

        ChatCompletionRequest req = new ChatCompletionRequest();
        req.setModel(config.getLlm().getModel());
        req.setMax_tokens(config.getLlm().getMaxTokens());
        req.setTemperature(0.5); // Чуть повышаем, чтобы он не боялся выбирать

        List<ChatCompletionRequest.Message> msgs = new ArrayList<>();
        msgs.add(new ChatCompletionRequest.Message("system", "Ты помощник, который создает сбалансированные маршруты. Ты умеешь отличать плохой фастфуд от хорошего кафе по названию."));
        msgs.add(new ChatCompletionRequest.Message("user", prompt));
        req.setMessages(msgs);

        try {
            log.info(">>> LLM Request. Candidates: {}, Food requested: {}", places.size(), isFoodRequested);

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

            if (resp == null || resp.getChoices() == null || resp.getChoices().isEmpty()) {
                return places;
            }

            String content = resp.getChoices().get(0).getMessage().getContent();
            // log.info(">>> LLM Raw: {}", content); // Можно включить для отладки

            String cleanJson = cleanLlmResponse(content);
            List<Selected> selected = mapper.readValue(cleanJson, new TypeReference<List<Selected>>() {
            });

            log.info(">>> LLM Selected {} places:", selected.size());
            selected.forEach(s -> log.info("   + {}", s.reason));

            Set<String> ids = selected.stream().map(s -> s.placeId).collect(Collectors.toCollection(HashSet::new));

            // Важно: сохраняем порядок из LLM, если он логичен, или исходный фильтрованный
            // Сейчас просто фильтруем исходный список, чтобы сохранить гео-сортировку (если она была)
            return places.stream()
                    .filter(p -> ids.contains(p.getId()))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error in LLM filter", e);
            return places.subList(0, Math.min(places.size(), 3));
        }
    }

    private String cleanLlmResponse(String content) {
        if (content == null) return "[]";
        Matcher matcher = JSON_BLOCK_PATTERN.matcher(content);
        if (matcher.find()) {
            return matcher.group(1);
        }
        int start = content.indexOf('[');
        int end = content.lastIndexOf(']');
        if (start != -1 && end != -1 && end > start) {
            return content.substring(start, end + 1);
        }
        return content;
    }

    public static class Selected {
        public String placeId;
        public String reason;
    }

    public static record PlaceCompactDto(String id, String name, String category) {
    }
    
}