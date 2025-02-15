const KEYCLOAK_URL = "http://localhost:8080/realms/social-network/protocol/openid-connect";
const AUTH_SERVICE_URL = "http://localhost:8081/auth/register";

export async function login(username: string, password: string) {
    const response = await fetch(`${KEYCLOAK_URL}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: "react-client",
            grant_type: "password",
            username,
            password,
        }),
    });

    if (!response.ok) throw new Error("Ошибка входа");

    return await response.json();
}

export async function register(username: string, password: string, email: string) {
    try {
        const response = await fetch(AUTH_SERVICE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username,
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка регистрации: ${errorText}`);
        }
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        throw error;
    }
}

export async function logout(token: string) {
    await fetch(`${KEYCLOAK_URL}/logout`, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({
            client_id: "social-network-client",
            refresh_token: token,
        }),
    });
}