const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = req.header('Authorization') || req.header('authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Remove "Bearer " prefix if it exists
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id, role: decoded.role }; // note _id to match your DB
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect };
