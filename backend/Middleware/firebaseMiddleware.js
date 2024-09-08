
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../config/firebaseAdmin');

const protectFirebase = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = await verifyToken(token);
      req.user = { uid: decoded.uid, email: decoded.email }; 
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, invalid Firebase token' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protectFirebase };
