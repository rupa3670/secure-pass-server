const rateLimit = require('express-rate-limit');

// General limiter - applies to all /api routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

// Strict limiter - for sensitive routes (profile update, user lookup by id)
const strictLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 30 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, slow down and try again later." },
});

module.exports = { generalLimiter, strictLimiter };