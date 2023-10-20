const rateLimit = require('express-rate-limit');

// Define rate limit options (adjust as needed)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3000,
});

module.exports = limiter;