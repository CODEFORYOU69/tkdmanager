import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const VerifyPage = () => {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState('Vérification en cours...');

  useEffect(() => {
    const { token, type } = router.query;

    if (token && type) {
      // Assurez-vous que l'URL est correctement configurée
      const verificationUrl = `/api/verify/verify?token=${token}&type=${type}`;
      
      fetch(verificationUrl)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setStatusMessage('Votre compte a été vérifié avec succès !');
            // Redirection optionnelle vers la page de connexion ou autre
            router.push('/login');
          } else {
            setStatusMessage(data.message || 'Erreur lors de la vérification.');
          }
        })
        .catch(error => {
          console.error('Erreur lors de la requête :', error);
          setStatusMessage('Erreur technique lors de la vérification.');
        });
    } else {
      setStatusMessage('Token ou type manquants dans l\'URL.');
    }
  }, [router, router.query]);

  return (
    <div>
      <p>{statusMessage}</p>
      {/* Vous pourriez vouloir afficher un indicateur de chargement ici jusqu'à la réception de la réponse */}
    </div>
  );
};

export default VerifyPage;
