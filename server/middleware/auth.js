import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRETKEY || 'SECRETKEY';

export function verifyToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        req.role = decoded.role;
        console.log("decoded.role:", decoded.role);
        next();

    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export function generateToken(userId,role) {
    const token = jwt.sign({userId,role}, secretKey, {
        expiresIn: '1h'
    });
    return token;
}