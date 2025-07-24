package ru.riveo.strollie.authorization_server.features.client_management;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ru.riveo.strollie.authorization_server.config.ApiIntegrationTest;
import ru.riveo.strollie.authorization_server.config.TestUserHelper;

public class AdminApiTests extends ApiIntegrationTest {

    @Autowired
    private TestUserHelper testUserHelper;

    @Value("${app.admin.email}")
    private String initialAdminEmail;

    @Value("${app.admin.nickname}")
    private String initialAdminNickname;
    private String initialAdminAccessToken;



    @BeforeEach
    void setUpAdminToken() throws Exception {
        testUserHelper.bootstrapFirstAdmin(initialAdminEmail, initialAdminNickname);
        this.initialAdminAccessToken = testUserHelper.getAccessTokenForUser(initialAdminEmail);
    }

    @Test
    void registerNewClient_withAdminToken_shouldReturnCreated() throws Exception {
        String clientPayload = """
                    {
                        "clientName": "Test Client From API Test",
                        "grantTypes": ["authorization_code", "refresh_token"],
                        "redirectUris": ["http://test.client/callback"],
                        "scopes": ["openid", "profile"]
                    }
                """;

        mockMvc.perform(post("/api/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + this.initialAdminAccessToken)
                        .content(clientPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.clientId").exists())
                .andExpect(jsonPath("$.clientSecret").exists());
    }

    @Test
    void assignAdminRole_withAdminToken_shouldSucceed() throws Exception {
        // Шаг 1: Создаем ОБЫЧНОГО пользователя через API.
        String potentialAdminEmail = "new.potential.admin@example.com";
        String userPayload = String.format("""
                {
                    "email": "%s",
                    "firstName": "Potential", "lastName": "Admin", "city": "Testville",
                    "dateOfBirth": "2000-01-01", "nickname": "potentialadmin"
                }
                """, potentialAdminEmail);

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userPayload))
                .andExpect(status().isCreated());

        // Шаг 2: Используем токен ИЗНАЧАЛЬНОГО админа, чтобы повысить нового пользователя.
        testUserHelper.assignRoleUsingApi(potentialAdminEmail, "ROLE_ADMIN", this.initialAdminAccessToken);

        String newAdminToken = testUserHelper.getAccessTokenForUser(potentialAdminEmail);

        String clientPayloadForNewAdmin = """
                    {
                        "clientName": "Client Created By New Admin",
                        "grantTypes": ["authorization_code", "refresh_token"],
                        "redirectUris": ["http://new.admin.client/callback"],
                        "scopes": ["openid", "profile"]
                    }
                """;

        mockMvc.perform(post("/api/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + newAdminToken)
                        .content(clientPayloadForNewAdmin))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.clientId").exists())
                .andExpect(jsonPath("$.clientSecret").exists());
    }
}