import React, { createContext, useContext, useState, useEffect } from 'react';
import LoadingWithImage from './LoadingWithImage'; // Assurez-vous que le chemin d'importation est correct

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // Ajoute un état de chargement

        // Fonction pour simuler la connexion
        const login = (token) => {
            localStorage.setItem('token', token);
            setUser({ token });
            setLoading(false);
        };
    
        // Fonction pour simuler la déconnexion
        const logout = () => {
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Supposons que cela simule un appel réseau pour valider le token
            setTimeout(() => {
                setUser({ token });
                setLoading(false);
            }, 2000); // Delai pour simuler l'appel réseau
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <LoadingWithImage />; // Affiche le loader pendant la vérification du token
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
