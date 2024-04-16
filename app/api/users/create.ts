// app/api/users/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../lib/userAuth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { email, name, password, clubName } = req.body;
        try {
            const user = await createUser(email, name, password, clubName);
            res.status(201).json({ user });
        } catch (error: any) {
            res.status(500).json({ message: "Could not create user", error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
