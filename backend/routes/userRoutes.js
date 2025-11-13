const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/authMiddleware');

// GET - Get all users
// router.get('/all', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// PUT - Update user by ID
router.put('/edit/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { fname, lname, email, phone, birthday } = req.body;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fname, lname, email, phone, birthday },
      { new: true, runValidators: true } // return updated document & validate fields
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/update-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both passwords' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.password || user.password.length < 50) {
      return res.status(500).json({ message: 'User password hash is invalid' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
