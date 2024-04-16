// app/api/users/authenticate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser } from '../../../lib/userAuth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        try {
            const result = await authenticateUser(email, password);
            if (result && typeof result !== 'boolean' && result.isAccepted) {
                // Authentification réussie et l'utilisateur est accepté
                res.status(200).json({ success: true, data: result });
            } else if (result && typeof result !== 'boolean' && !result.isAccepted) {
                // Utilisateur trouvé mais pas encore accepté
                res.status(403).json({ success: false, message: "User not accepted by club" });
            } else {
                // Échec de l'authentification, mauvais identifiants
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        } catch (error: any) {
            res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
