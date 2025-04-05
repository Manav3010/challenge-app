const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Extract token from Bearer string
    const accessToken = token.split(' ')[1];

    // ✅ Verify token (handles expiration automatically)
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Access token expired' });
    }

    console.error('Auth middleware error:', err.message);
    res.status(401).json({ msg: 'Token is invalid' });
  }
};

module.exports = auth;
