const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 📌 POST /api/register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  // 🛡 Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  try {
    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 📥 Save user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 📌 POST /api/login
const login = async (req, res) => {
  const { email, password } = req.body;

  // 🛡 Basic validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // 🔍 Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // 🎟 Create access token (10 min expiry)
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    // 🔁 Create refresh token (1 day expiry)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '1d' }
    );

    // 🍪 Store refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 📤 Send access token + user info
    res.status(200).json({
      token: accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { register, login };
