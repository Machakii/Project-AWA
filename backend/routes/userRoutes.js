const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Edit profile
router.put('/edit/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { fname, lname, email, phone, birthday } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fname, lname, email, phone, birthday },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully!', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update password (protected)
router.put('/update-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Please provide both passwords' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // compare
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Invalid current password' });

    // set plain new password -> model pre-save will hash before save
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide password
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const userId = req.params.id;

    // Optional: prevent deleting yourself
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You can't delete yourself" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Toggle role (Admin only)
router.put('/toggle-role/:id', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Toggle role
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.json({ message: 'Role updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;