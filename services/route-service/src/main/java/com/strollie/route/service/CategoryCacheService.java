package com.strollie.route.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strollie.route.model.dto.CategoryDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryCacheService {

    private final ObjectMapper objectMapper;
    @Value("classpath:categories.json")
    private Resource resourceFile;
    private List<CategoryDto> categories = new ArrayList<>();

    @PostConstruct
    public void init() {
        log.info("Загрузка категорий из файла: {}", resourceFile.getFilename());

        try {
            if (!resourceFile.exists()) {
                log.error("Файл категорий не найден: {}", resourceFile.getDescription());
                throw new RuntimeException("Файл categories.json не найден");
            }

            categories = objectMapper.readValue(resourceFile.getInputStream(), new TypeReference<List<CategoryDto>>() {
            });

            log.info("Категории успешно загружены. Количество записей: {}", categories.size());

        } catch (IOException e) {
            log.error("Ошибка при чтении файла категорий JSON", e);
            throw new RuntimeException("Не удалось инициализировать кэш категорий", e);
        }
    }

    public List<CategoryDto> getAllCategories() {
        return categories;
    }

    public String getCategoryNameById(String id) {
        log.debug("Поиск названия категории по ID: {}", id);

        return categories.stream().filter(c -> c.getId().equals(id)).findFirst().map(CategoryDto::getName).orElseGet(() -> {
            log.warn("Категория с ID {} не найдена", id); // WARN если ID пришел, но его нет в базе
            return null;
        });
    }
}