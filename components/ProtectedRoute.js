import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';
import LoadingWithImage from './LoadingWithImage'; // Assurez-vous que le chemin d'importation est correct

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Ajoutez loading depuis votre hook
    const router = useRouter();

    useEffect(() => {
        
        if (loading && !user) {
                        
            router.push('/login'); // Redirige vers login si pas connecté et chargement terminé
        }
    }, [user, loading, router]);

    

    return children;
};

export default ProtectedRoute;
