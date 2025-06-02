const jsonwebtoken = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';

const userAuth = (req, res, next) => {
    const token = req.headers['x-access-token'];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    jsonwebtoken.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
        }
    
        req.user = decoded;
        next();
    });
}


const adminAuth = (req, res, next) => {
    const token = req.headers['x-access-token'];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    jsonwebtoken.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        
        req.user = decoded;
        next();
    });
}

module.exports = {
    userAuth,
    adminAuth
};