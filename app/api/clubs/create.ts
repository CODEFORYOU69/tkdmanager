// app/api/clubs/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClub } from '../../../lib/clubAuth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { name, email, password } = req.body;
        try {
            const club = await createClub(name, email, password);
            res.status(201).json({ club });
        } catch (error: any) {
            res.status(500).json({ message: "Could not create club", error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
