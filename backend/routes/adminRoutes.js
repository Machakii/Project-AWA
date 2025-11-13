const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: admin only' });
  }
  res.json({ message: 'Secret admin data: 42' });
});

module.exports = router;
