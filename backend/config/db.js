const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const ATLAS_URI = 'mongodb+srv://mounip2006_db_user:hVX1F3Bp7EO8x1pY@cluster0.mz418kr.mongodb.net/projectmate?retryWrites=true&w=majority';
  const mongoUri = process.env.MONGO_URI || ATLAS_URI;

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('MongoDB disconnected. Retrying connection...');
  setTimeout(connectDB, 5000);
});

module.exports = connectDB;
