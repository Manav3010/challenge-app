const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ⏳ Access: 15m | 🔁 Refresh: 30d
const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY = '30d';

const register = async (req, res) => {
  const { username, email, password, phone } = req.body;

  // ✅ Basic validations
  if (!username || !email || !password || !phone) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ msg: 'Invalid phone number format. Must be 10 digits.' });
  }

  // ✅ Check for existing email
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // ✅ Hash and save
  const hashed = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashed,
    phone,
  });

  res.status(201).json({ msg: 'Registered successfully' });
};


const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    token: accessToken,
    user: { id: user._id, username: user.username, email: user.email },
  });
};

const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ msg: 'Missing refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
    res.status(200).json({ token: accessToken });
  } catch (err) {
    return res.status(403).json({ msg: 'Refresh token invalid or expired' });
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,      // make sure this matches how you originally set the cookie
    sameSite: 'Strict' // or 'Lax' if that's how it was set
  });
  return res.status(200).json({ msg: 'Logged out successfully' });
};

module.exports = { register, login, refresh, logout };
