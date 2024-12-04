import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { exit } from 'node:process';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    logger.info(`======= MongoDB Connected: ${connection.connection.host} =======`);
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    exit(1);
  }
};

export const MembersSchema = mongoose.model(
  'members',
  new mongoose.Schema({
    user_id_text: { type: String, required: true },
    last_vc_time: { type: Date, required: Date.now },
    retire: { type: Boolean, required: true },
    day_off: { type: Date, default: 0 },
  }),
);
