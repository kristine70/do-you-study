import {exit} from 'node:process';
import {BotClient} from './services/bot';
import {logger} from './utils/logger';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new BotClient();

bot.login(process.env.TOKEN).catch((error) => {
  logger.error('bot login ERROR!!!', error);
  exit(1);
});
