// pages/api/verifyToken.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authorization.split(' ')[1]; // Assuming "Bearer [token]" format
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Optionally check other things here (e.g., token expiry handled automatically)
        
        res.status(200).json({ isValid: true });
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ isValid: false, message: 'Invalid token' });
    }
}
