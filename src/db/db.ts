import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { exit } from 'node:process';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    logger.info(
      `======= MongoDB Connected: ${connection.connection.host} =======`,
    );
  } catch (err) {
    logger.error('MongoDB Connection Error:', err);
    exit(1);
  }
};
