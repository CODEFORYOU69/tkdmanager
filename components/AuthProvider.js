import React, { createContext, useContext, useState, useEffect } from 'react';
import LoadingWithImage from './LoadingWithImage'; // Assurez-vous que le chemin d'importation est correct

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // Ajoute un état de chargement

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('/api/verifyToken', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await response.json();

                    if (response.ok && data.isValid) {
                        setUser({ token });
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    logout();
                }
            }
            setLoading(false);  // Termine le chargement après la vérification
        };

        verifyToken();
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    if (loading) {
        return <LoadingWithImage />; // Affiche le loader pendant la vérification
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {user ? children : null} 
        </AuthContext.Provider>
    );
};
