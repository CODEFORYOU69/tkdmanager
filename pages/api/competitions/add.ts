// pages/api/competitions/add.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, date, image } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { clubId: string };
        const clubId = parseInt(decoded.clubId);
        if (!decoded) {
            return res.status(403).json({ message: "Unauthorized operation" });
        }

        try {
            const newCompetition = await prisma.competition.create({
                data: {
                    name,
                    date: new Date(date),
                    clubId: clubId,
                    image
                },
            });
            res.status(201).json(newCompetition);
        } catch (error: any) {
            res.status(500).json({ message: `Could not create competition: ${error.message}` });
        }
    } else {
        res.status(405).end('Method Not Allowed');
    }
}
