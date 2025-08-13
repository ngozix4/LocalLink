const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// Security middleware
module.exports = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Limit requests from same API
  const limiter = rateLimit({
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15*60*1000,
    message: 'Too many requests from this IP, please try again later'
  });
  app.use('/api', limiter);

  // Data sanitization against XSS
  app.use(xss());

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());
};