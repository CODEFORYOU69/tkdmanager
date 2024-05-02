import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser } from '../../lib/userAuth';
import { authenticateClub } from '../../lib/clubAuth';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      let account = await authenticateUser(email, password);
      let role = "user";  // Définir le rôle par défaut comme utilisateur

      if (!account) {
        let account2 = await authenticateClub(email, password);
        role = "club";  // Changer le rôle si c'est un club qui est authentifié
        if (!account2) {
          return res.status(401).json({ message: 'Invalid credentials or account not accepted' });
          
        }
        const token = jwt.sign(
          {
            clubId: account2.id,  // Supposons que l'ID est présent dans les deux types de comptes
            email: account2.email,  // Supposons que l'email est également présent
            role  // Inclure le rôle déterminé dynamiquement
          },
          process.env.JWT_SECRET as string,
          { expiresIn: '7d' }
        );
        // Retourner le token et les informations pertinentes
        res.status(200).json({
          token,
          account: { id: account2.id, email: account2.email, role }
        });
        return;
      }

      if (!account) {
        return res.status(401).json({ message: 'Invalid credentials or account not accepted' });
      }

      // Création du JWT
      const token = jwt.sign(
        {
          id: account.id,  // Supposons que l'ID est présent dans les deux types de comptes
          clubId: account.clubId ,// Supposons que l'ID du club est présent si c'est un compte de club
          email: account.email,  // Supposons que l'email est également présent
          role  // Inclure le rôle déterminé dynamiquement
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      // Retourner le token et les informations pertinentes
      res.status(200).json({
        token,
        account: { id: account.id, email: account.email, role }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
      } else {
        res.status(500).json({ message: 'An unknown server error occurred' });
      }
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
