// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../path/to/AuthContext'; // Assurez-vous d'ajuster le chemin

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            // Redirige vers la page de login si l'utilisateur n'est pas connecté
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return null; // ou un composant de chargement pendant que la redirection prend effet
    }

    return children;
};

export default ProtectedRoute;
