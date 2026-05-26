import {useState} from "react";
import {login} from "../services/authService";
import {useNavigate} from "react-router-dom";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const data = await login(username, password);
            localStorage.setItem("token", data.access_token);
            navigate("/");
        } catch (error) {
            alert("Ошибка входа");
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Войти</button>
        </div>
    );
}
