package com.strollie.route.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(name = "Category", description = "Категория места/активности")
public class CategoryDto {

    @JsonProperty("category")
    @Schema(description = "Название категории", example = "Музеи")
    private String name;

    @JsonProperty("id")
    @Schema(description = "Идентификатор категории", example = "museum")
    private String id;

}
