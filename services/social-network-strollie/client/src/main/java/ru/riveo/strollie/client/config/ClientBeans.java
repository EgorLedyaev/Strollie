package ru.riveo.strollie.client.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.web.client.RestClient;
import ru.riveo.strollie.client.client.RestClientMessenger;
import ru.riveo.strollie.client.security.OAuthClientHttpRequestInterceptor;

@Configuration
public class ClientBeans {

    @Bean
    public RestClientMessenger productsRestClient(
            @Value("${messenger.service.base-url:http://messenger:8082}") String catalogueBaseUri,
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientRepository authorizedClientRepository,
            @Value("${strollie.services.catalogue.registration-id:keycloak}") String registrationId) {
        return new RestClientMessenger(RestClient.builder()
                .baseUrl(catalogueBaseUri)
                .requestInterceptor(
                        new OAuthClientHttpRequestInterceptor(
                                new DefaultOAuth2AuthorizedClientManager(clientRegistrationRepository,
                                        authorizedClientRepository), registrationId))
                .build());
    }

}