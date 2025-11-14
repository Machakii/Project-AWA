const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// REGISTER
const registerUser = async (req, res) => {
  try {
    let { fname, lname, name, email, password, phone, birthday, role } = req.body;

    if (!fname && !lname && name) {
      const parts = name.trim().split(' ');
      fname = parts[0];
      lname = parts.slice(1).join(' ') || '';
    }

    if (!fname || !lname || !email || !password) {
      return res.status(400).json({ message: 'Please provide full name, email and password' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Do NOT hash here; model pre-save will hash password
    const user = await User.create({
      fname,
      lname,
      email: email.toLowerCase(),
      password, // plain here -> pre('save') will hash
      phone,
      birthday,
      role
    });

    return res.status(201).json({
      id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    return res.status(200).json({
      id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET PROFILE (protected)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getProfile };
