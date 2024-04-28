import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { matchId } = req.query; // Access matchId from the query parameters

    if (!matchId) {
        return res.status(400).json({ message: "Missing matchId parameter" });
    }

    if (req.method === 'GET') {
        try {
            const rounds = await prisma.round.findMany({
                where: {
                    matchId: parseInt(matchId),
                  
                },
            });
         console.log("rounds", rounds);
            if (rounds.length > 0) {
                res.status(200).json(rounds);
            } else {
                // Envoyez une réponse HTTP même quand il n'y a pas de rounds
                res.status(204).send(); // 204 No Content
            }
        } catch (error) {
            console.error('Error fetching rounds:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end('Method Not Allowed');
    }
}
