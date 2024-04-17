import jwt from 'jsonwebtoken';

// Utilisez votre framework serveur préféré, par exemple Express.js

app.get('/api/verifyToken', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    jwt.verify(token, 'votre_secret_jwt', (err, decoded) => {
        if (err) {
            return res.status(401).json({ isValid: false });
        }
        res.json({ isValid: true, userId: decoded.id });
    });
});
