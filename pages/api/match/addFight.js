import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { competitionId, fighterId, fightNumber, color } = req.body;
        console.log("req.body:", req.body);

        try {
            // Create a new match or round record in the database
            const newMatch = await prisma.match.create({
                data: {
                    competitionId,
                    fighterId,
                    fightNumber: parseInt(fightNumber, 10),
                    color,
                }
            });
            res.status(200).json(newMatch);
        } catch (error) {
            console.error('Failed to add fight to competition:', error);
            res.status(500).json({ message: 'Failed to add fight to competition', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
