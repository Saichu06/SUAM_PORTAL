const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/auth.controller');

// Authenticates JWT from Authorization header
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token is expected as "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token is missing.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware helper to restrict endpoints based on user roles
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. Authentication required.' });
    }

    const hasRole = allowedRoles.some(role => req.user.role.toLowerCase() === role.toLowerCase());
    
    if (!hasRole) {
      return res.status(403).json({ message: 'Access forbidden. Insufficient permissions.' });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};
