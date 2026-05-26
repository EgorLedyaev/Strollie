package com.strollie.route.web;

import com.strollie.route.model.dto.CategoryDto;
import com.strollie.route.service.CategoryCacheService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "Справочник доступных категорий мест")
public class CategoryController {

    private final CategoryCacheService categoryService;

    @GetMapping
    @Operation(summary = "Получение списка категорий",
            description = "Возвращает полный список категорий, доступных для построения маршрутов")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Список категорий",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = CategoryDto.class))))
            ,
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка",
                    content = @Content(schema = @Schema(hidden = true)))
    })
    public List<CategoryDto> getCategories() {
        return categoryService.getAllCategories();
    }

}
