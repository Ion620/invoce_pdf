import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (localStorage.getItem('token')) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Authentication error:', error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            localStorage.setItem('token', response.token);
            setUser(response.user);
            return response;
        } catch (error) {
            throw error.response.data;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            localStorage.setItem('token', response.token);
            setUser(response.user);
            return response;
        } catch (error) {
            throw error.response.data;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            localStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
