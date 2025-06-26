import   jwt from 'jsonwebtoken';
const secretKey = process.env.SECRETKEY||'SECRETKEY';
export function verifyToken(req, res, next) {
    const token = req.header('Authorization');
     console.log(token);
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        req.role = decoded.role;
        req.email = decoded.email;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export function generateToken(userId, role, email) {
const token = jwt.sign({ userId,role ,email}, secretKey, {
 expiresIn: '1h'
 });
 return token;
 }
 
export function isAdmin(req, res, next) {  
     console.log("req.role:", req.role);
    if (req.role != 'admin') { 
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
}