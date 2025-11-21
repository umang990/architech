const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to send token in cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_fallback_key', {
    expiresIn: '30d',
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true, // Prevent client-side JS access (Security)
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in prod
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  sendTokenResponse(user, 201, res);
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide an email and password' });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  sendTokenResponse(user, 200, res);
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
const updateDetails = async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar // In a real app, this would come from an upload middleware
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
};

module.exports = { register, login, getMe, logout, updateDetails };