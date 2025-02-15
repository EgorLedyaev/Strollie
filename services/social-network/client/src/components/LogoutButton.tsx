import {logout} from "../services/authService";
import {useNavigate} from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            await logout(token);
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    return <button onClick={handleLogout}>Выйти</button>;
}
