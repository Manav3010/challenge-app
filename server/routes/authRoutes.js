const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { register, login } = require('../controllers/authController');

// 🧾 POST /api/register — Register a new user
router.post('/register', register);

// 🔐 POST /api/login — Login and set refresh token in cookie
router.post('/login', login);

// 🔄 POST /api/refresh — Get new access token using refresh token from cookie
router.post('/refresh', (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ msg: 'No refresh token found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    return res.status(200).json({ token: newAccessToken });
  } catch (err) {
    console.error('❌ Refresh error:', err.message);
    return res.status(403).json({ msg: 'Invalid or expired refresh token' });
  }
});

// 🚪 OPTIONAL: Add logout route to clear the refresh token cookie
// router.post('/logout', (req, res) => {
//   res.clearCookie('refreshToken', {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'Strict',
//   });
//   return res.status(200).json({ msg: 'Logged out successfully' });
// });

module.exports = router;
