require('dotenv').config();
const express = require('express');
const path = require("path");
const bcrypt = require('bcrypt');
const app = express();
const morgan = require('morgan')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer')
const connectDB = require('./config/db');
const sessionMiddleware = require('./config/sessions');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com"
        ],
      },
    },
  })
);

app.set('trust proxy', 1);
app.use(sessionMiddleware);
app.set('etag', false);

// Logging - enable in production
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Connect to Database
connectDB();

// Routes
app.use('/', require('./routes/pageroutes'));
app.use('/getproducts', require('./routes/pageroutes'));
app.use('/slugproduct/:slug', require('./routes/pageroutes'));
app.use('/cart/add', require('./routes/pageroutes'));
app.use('/api/products/search', require('./routes/pageroutes'));

// 404 Handler - must be after all routes
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler - must be last middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Log error for monitoring
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${err.stack}`);
    
    // Send appropriate error response
    if (process.env.NODE_ENV === 'production') {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal Server Error'
        });
    } else {
        res.status(err.status || 500).json({
            success: false,
            message: err.message,
            stack: err.stack
        });
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
