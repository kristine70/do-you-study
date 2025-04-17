import {BotClient} from './bot';
import {TextChannel} from 'discord.js';
import config from '../config';
import {logger} from '../utils/logger';
import {getLists} from './list';

const sendMessage = async (channel: TextChannel, userIds: string[], content: string) => {
  try {
    await channel.send({content, allowedMentions: {users: userIds}});
  } catch (error) {
    logger.error('[SEND MESSAGE] fail:', error);
  }
};

export const SendRemindMessage = (bot: BotClient) => {
  const {list7, list14} = getLists();
  void sendMessage(bot.managerChannel, list7, config.MESSAGE_CONTENT(list7));
  void sendMessage(bot.managerChannel, list14, list14);

  logger.info(`======log======`);
  logger.info(` 7 days: ${JSON.stringify(days7)}`);
  logger.info(`14 days: ${JSON.stringify(days14)}`);
};
