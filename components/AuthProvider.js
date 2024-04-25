import React, { createContext, useContext, useState, useEffect } from 'react';
import LoadingWithImage from './LoadingWithImage'; // Vérifiez que le chemin d'importation est correct

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({ role:'', name: '', imageUrl: '', clubName: '', clubImageUrl: '', clubId: '' });
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        const role = localStorage.getItem('role').replace(/"/g, '');
        const token = localStorage.getItem('token');
        setProfile(prev => ({
                    ...prev,
                    role: role,
                }));
        
        if (role  && token) {
            try {
                const response = await fetch(`/api/profile?profileType=${role}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                
                setProfile(prev => ({
                    ...prev,
                    name: data.name,
                    imageUrl: data.image,
                    clubId: data.clubId
                }));

                // Si l'utilisateur est connecté et le rôle est 'user', obtenir également les informations du club
if (role === 'user' && data.clubId) {
    const clubResponse = await fetch(`/api/club/${data.clubId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const clubData = await clubResponse.json();
    setProfile(prev => ({
        ...prev,
        clubName: clubData.name,
        clubImageUrl: clubData.image
    }));
}

            } catch (error) {
                console.error('Error fetching profile or club info:', error);
            }
        }
    };

    // Fonctions pour gérer la connexion et la déconnexion
    const login = async (token) => {
        localStorage.setItem('token', token);
        setUser({ token });
        await fetchProfile();
        setLoading(false);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setTimeout(async () => {
                await fetchProfile();
                setLoading(false);
            }, 3000);
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <LoadingWithImage />;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, profile }}>
            {children}
        </AuthContext.Provider>
    );
};
