import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { fighterId, competitionId, fights } = req.body;  // Extraction des données à partir de la structure que vous avez fournie

        // Filtre pour éliminer les combats non remplis correctement
        const validFights = fights.filter(fight => fight.fightNumber && fight.color);

        try {
            if (validFights.length === 0) {
                return res.status(400).json({ message: "No valid fights provided." });
            }

            // Création de multiples matchs en utilisant `createMany`
            const newMatches = await prisma.match.createMany({
                data: validFights.map(fight => ({
                    competitionId,
                    fighterId,
                    fightNumber: parseInt(fight.fightNumber, 10),
                    color: fight.color,
                })),
                skipDuplicates: true, // Ignorer les doublons si nécessaire
            });

            res.status(201).json(newMatches);
        } catch (error) {
            console.error('Failed to add fights to competition:', error);
            res.status(500).json({ message: 'Failed to add fights to competition', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
