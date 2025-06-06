import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    // Check if we are already connected to avoid re-connecting
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    const database = await mongoose.connect(process.env.MONGODB_URI!);
    return database;
  } catch (error) {
    console.error('Could not connect to database:', error);
    process.exit(1);
  }
};

export default dbConnect;
