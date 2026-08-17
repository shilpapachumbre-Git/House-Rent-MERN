const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next(); // <- return add kela
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const isOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') { // <- DB madhe 'owner' lowercase aahe
    return next(); // <- return add kela
  } else {
    return res.status(403).json({ message: 'Not authorized as Owner' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') { // <- DB madhe 'admin' lowercase aahe
    return next(); // <- return add kela
  } else {
    return res.status(403).json({ message: 'Not authorized as Admin' });
  }
};

module.exports = { protect, isOwner, isAdmin };