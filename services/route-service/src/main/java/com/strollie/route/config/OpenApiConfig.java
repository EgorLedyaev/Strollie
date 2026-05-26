package com.strollie.route.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI routeOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Route API")
                        .description("API для генерации туристических маршрутов и справочника категорий")
                        .version("v1")
                        .contact(new Contact()
                                .name("Strollie")
                                .email("support@strollie.com"))
                        .license(new License().name("MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8082").description("Локальная среда")))
                .externalDocs(new ExternalDocumentation()
                        .description("Дополнительная документация")
                        .url("https://swagger.io/docs/")
                );
    }

    @Bean
    public GroupedOpenApi routesGroup() {
        return GroupedOpenApi.builder()
                .group("routes")
                .packagesToScan("com.strollie.route.web")
                .pathsToMatch("/api/routes/**")
                .build();
    }

    @Bean
    public GroupedOpenApi categoriesGroup() {
        return GroupedOpenApi.builder()
                .group("categories")
                .packagesToScan("com.strollie.route.web")
                .pathsToMatch("/api/categories/**")
                .build();
    }
}
