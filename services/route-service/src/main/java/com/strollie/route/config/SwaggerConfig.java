package com.strollie.route.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Strollie Route Service API")
                        .description("Генерация туристических маршрутов на основе 2GIS, LLM и OpenRoute")
                        .version("0.1.0")
                        .license(new License().name("MIT"))
                );
    }
}