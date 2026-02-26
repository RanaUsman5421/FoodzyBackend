const session = require('express-session');
const { MongoStore } = require('connect-mongo');

const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

module.exports = session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    collectionName: 'sessions',
    ttl: 60 * 60
  }),
  cookie: {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
  }
});
