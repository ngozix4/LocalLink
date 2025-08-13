const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Business = require('../models/Business'); // Your Mongoose Business model

/**
 * Authentication middleware that verifies JWT tokens
 * and attaches the authenticated business to the request object
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from headers
    const token = extractToken(req);
    
    // 2. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      throw createError(401, 'Invalid token payload');
    }
    
    // 3. Get business from MongoDB
    const business = await Business.findById(decoded.userId)
      .select('-password -__v') // Exclude sensitive fields
      .lean(); // Return plain JS object
    
    if (!business) {
      throw createError(404, 'Business account not found');
    }
    
    // 4. Attach business to request
    req.user = {
      ...business,
      id: business._id.toString() // For consistency
    };
    
    next();
  } catch (error) {
    // Handle JWT errors specifically
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired'));
    }
    next(error);
  }
};

/**
 * Role-based access control middleware
 * @param {string[]} allowedRoles - Array of allowed roles
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw createError(401, 'Authentication required');
      }
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        throw createError(403, 'Insufficient permissions');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Extracts token from various sources (header, query, cookie)
 */
function extractToken(req) {
  // Check Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  
  // Check query parameter
  if (req.query && req.query.token) {
    return req.query.token;
  }
  
  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  throw createError(401, 'No authentication token found');
}

module.exports = {
  authenticate,
  authorize
};