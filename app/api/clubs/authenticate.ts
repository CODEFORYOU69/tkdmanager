// app/api/clubs/authenticate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateClub } from '../../../lib/clubAuth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        try {
            const result = await authenticateClub(email, password);
            if (result) {
                // Authentification réussie
                res.status(200).json({ success: true, data: result });
            } else {
                // Échec de l'authentification
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
