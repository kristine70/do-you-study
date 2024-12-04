import { Client } from 'eris';
import dotenv from 'dotenv';
import reminder from '../controller/Reminder';
import config from '../config';
import { connectDB } from '../db/db';
import { logger } from '../utils/logger';

dotenv.config();

export default class DiscordBot {
  async run() {
    await connectDB();
    const bot = new Client(process.env.TOKEN!, { intents: [53608447] });

    bot.on('ready', () => {
      logger.info('Bot is start!');
      reminder.schedule(bot, config.REMINDER_CHANNEL_ID);
    });

    bot.connect();
  }
}
