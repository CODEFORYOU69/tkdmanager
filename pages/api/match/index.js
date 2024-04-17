import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { competitionId } = req.query;

    if (req.method === 'GET') {
        try {
            const matches = await prisma.match.findMany({
                where: { competitionId: parseInt(competitionId) },
                include: {
                    fighter: true, // Assuming a relation exists to include fighter details
                }
            });
            console.log("matches", matches);
            res.status(200).json(matches);
        } catch (error) {
            console.error('Error fetching matches:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
