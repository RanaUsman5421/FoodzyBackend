const session = require('express-session');
const {MongoStore} = require('connect-mongo');

const isProduction = process.env.NODE_ENV === 'production';

// Get MongoDB URL from environment - support multiple variable names
const getMongoUrl = () => {
  const mongoUrl = process.env.MONGODB_URI || process.env.DB_URL || process.env.MONGO_URI;
  if (!mongoUrl) {
    console.warn('Warning: MongoDB URL not found in environment variables. Sessions will not be stored in MongoDB.');
    return undefined;
  }
  return mongoUrl;
};

const mongoUrl = getMongoUrl();

module.exports = session({
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: mongoUrl ? MongoStore.create({
      mongoUrl: mongoUrl,
      collectionName: 'sessions',
      ttl: 60 * 60 * 60 * 60, // 1 hour
    }) : undefined,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      partitioned: false,
    },
  });
