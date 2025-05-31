package ru.riveo.strollie.messenger.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${rabbitmq.host:localhost}")
    private String rabbitHost;

    @Value("${rabbitmq.stomp.port:61613}")
    private int rabbitStompPort;

    @Value("${rabbitmq.user:guest}")
    private String rabbitUser;

    @Value("${rabbitmq.password:guest}")
    private String rabbitPassword;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.setApplicationDestinationPrefixes("/app");

        config.enableStompBrokerRelay("/topic", "/queue")
                .setRelayHost(rabbitHost)
                .setRelayPort(rabbitStompPort)
                .setClientLogin(rabbitUser)
                .setClientPasscode(rabbitPassword)
                .setSystemLogin(rabbitUser)
                .setSystemPasscode(rabbitPassword);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-messenger")
                .setAllowedOriginPatterns("*");
    }
}