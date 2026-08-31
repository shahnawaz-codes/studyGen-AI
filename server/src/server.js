import dotenv from 'dotenv';
import connectDB from './config/database.config.js';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 StudyGen AI Modular Server listening on port ${PORT}`);
});
