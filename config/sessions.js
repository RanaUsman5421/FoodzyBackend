const session = require('express-session');
const {MongoStore} = require('connect-mongo');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = session({
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || process.env.DB_URL,
      collectionName: 'sessions',
      ttl: 60 * 60 * 60 * 60, // 1 hour
    }),
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      sameSite: 'lax', // Changed from 'strict' for better cross-site compatibility
      secure: isProduction, // Only use secure cookies in production (requires HTTPS)
      partitioned: false,
    },
  });
