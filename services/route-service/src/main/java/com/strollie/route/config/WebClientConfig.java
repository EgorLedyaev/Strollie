package com.strollie.route.config;

import io.netty.channel.ChannelOption;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import reactor.netty.http.client.HttpClient;

@Configuration
public class WebClientConfig {
    @Bean
    public WebClient webClient(@Autowired ApiKeysConfig config) {
        int connectTimeout = Math.max(5000,
                Math.max(
                        config.getGis() != null ? config.getGis().getTimeout() : 0,
                        config.getLlm() != null ? config.getLlm().getTimeout() : 0
                )
        );

        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofMillis(connectTimeout))
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, connectTimeout);

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
