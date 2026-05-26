import {ReactNode, useEffect} from "react";
import {useNavigate} from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return <>{children}</>;
}
