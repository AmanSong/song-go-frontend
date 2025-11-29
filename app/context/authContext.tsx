import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { authUtility } from "../utils/authUtility";

interface User {
    id: string;
    email: string;
    displayName?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => false,
    logout: async () => { },
    refreshSession: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Called on app startup
    const loadStoredSession = async () => {
        const storedToken = await SecureStore.getItemAsync("token");

        if (storedToken) {
            setToken(storedToken);

            const session = await authUtility.getSession(storedToken);

            if (session.isAuthenticated) {
                setUser(session.user);
            }
        }

        setIsLoading(false);
    };


    useEffect(() => {
        loadStoredSession();
    }, []);

    // Login handler
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const res = await authUtility.handleLogin(email, password);

            if (!res) {
                console.log("No data received!");
                setIsLoading(false);
                return false;
            }

            const { token, user } = res;

            setToken(token);
            setUser(user);

            await SecureStore.setItemAsync("token", token);

            setIsLoading(false);
            return true;
        } catch (err) {
            setIsLoading(false);
            console.error(err);
            return false;
        }
    };

    // Logout handler
    const logout = async () => {
        setToken(null);
        setUser(null);
        await SecureStore.deleteItemAsync("token");
    };

    // Manually refresh session
    const refreshSession = async () => {
        if (!token) return;

        const session = await authUtility.getSession(token);

        if (session.isAuthenticated) {
            setUser(session.user);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                refreshSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
