import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Assurez-vous d'avoir installé axios

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('/api/verifyToken', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log("response", response)
                    const data = await response.json(); // Get JSON response body
                    
                    if (response.ok && data.isValid) {
                        setUser({ token });
                    } else {
                        logout(); // Logout user if token is invalid
                    }
                } catch (error) {
                    console.error('Failed to verify token:', error);
                    logout(); // Logout on any error
                }
            }
        };
    
        verifyToken();
    }, []); // Ensures this effect runs only once after the initial render
    

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
