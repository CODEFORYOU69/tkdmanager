// app/api/clubs/accept.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { findClubByName, acceptUser } from '../../../lib/clubAuth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { userId, clubName } = req.body;

        try {
            const club = await findClubByName(clubName);
            await acceptUser(userId, club.id);
            res.status(200).json({ success: true, message: "User has been accepted into the club" });
        } catch (error: any) {
            switch (error.message) {
                case "Club not found.":
                    res.status(404).json({ success: false, message: "Club not found" });
                    break;
                case "User does not belong to the specified club or user not found.":
                    res.status(404).json({ success: false, message: "User does not belong to the specified club or user not found" });
                    break;
                default:
                    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
