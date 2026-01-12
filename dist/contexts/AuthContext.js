import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
const API_URL = window.env.VITE_API_URL || "http://localhost:4000";
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const login = async (tc, password) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tc, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error("[Auth] Login failed:", data.message || res.statusText);
                return false;
            }
            if (!data.success) {
                console.error("[Auth] Login unsuccessful:", data.message);
                return false;
            }
            setUser(data.user);
            return true;
        }
        catch (err) {
            console.error("[Auth] Login error:", err);
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    const signOut = () => {
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, loading, login, signOut }, children: children }));
};
