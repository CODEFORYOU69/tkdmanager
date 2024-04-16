// pages/api/fighters/index.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const fighters = await prisma.fighter.findMany();
            res.status(200).json(fighters);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching fighters', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
