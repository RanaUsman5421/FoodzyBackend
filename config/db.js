const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Support multiple environment variable names
    const mongoUri = process.env.DB_URL || process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MongoDB Error: No MongoDB URL found in environment variables.');
      console.log('Please set DB_URL, MONGODB_URI, or MONGO_URI in your .env file.');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
