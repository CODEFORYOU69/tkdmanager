import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const competitions = await prisma.competition.findMany();
        res.status(200).json(competitions);
    } catch (error) {
        console.error('Error fetching competitions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
