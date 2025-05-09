// backend/middleware/authenticateUser.js
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, "yourJWTsecret");
        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication invalid' });
    }
};

module.exports = authenticateUser;
