import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find(row => row.startsWith("token="));
        if (!tokenCookie) return;

        const token = tokenCookie.split("=")[1];
        try {
            const decoded = jwtDecode(token);
            setUser({
                email: decoded.sub, 
            });
        } catch (err) {
            console.error("Invalid token", err);
        }
    }, []);

    return user;
}