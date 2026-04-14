const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization') || req.header('authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: verified.id || verified.userId // ✅ safe mapping
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;