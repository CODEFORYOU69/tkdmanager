
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'; // Assurez-vous d'avoir installé 'jsonwebtoken'

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Vérifiez si le token est fourni dans les headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            // Décoder le token pour obtenir le clubId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const clubId = decoded.clubId;

            // Utiliser le clubId pour filtrer les fighters
            const fighters = await prisma.competition.findMany({
                where: {
                    clubId: clubId
                }
            });
            res.status(200).json(fighters);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            res.status(500).json({ message: 'Error fetching competitions', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
