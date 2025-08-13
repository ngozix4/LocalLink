const jwt = require('jsonwebtoken');

const createTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  
  return { accessToken, refreshToken };
};

const verifyToken = (token, isRefresh = false) => {
  return jwt.verify(
    token,
    isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET
  );
};

module.exports = { createTokens, verifyToken };