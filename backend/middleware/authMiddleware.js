const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    let token = req.header('Authorization') || req.header('authorization') || '';

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // support "Bearer <token>" and raw token
    if (token.startsWith('Bearer ')) token = token.slice(7).trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // set a consistent property
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect };