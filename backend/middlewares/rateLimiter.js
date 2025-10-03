const rateLimit = require("express-rate-limit");

// Basic rate limiter: 5 requests per 1 minutes per IP
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

module.exports = limiter;
