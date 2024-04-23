// pages/api/users/adduser.js
import { createUser } from '../../../lib/userAuth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, password, clubId, imageUrl } = req.body;
    
    try {
      const newUser = await createUser(email, name, password, clubId, imageUrl);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
