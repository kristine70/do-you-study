import { Client, MessageContent } from 'eris';
import cron from 'node-cron';
import { logger } from '../utils/logger';
import config from '../config';

export default class CronJobReminder {
  schedule(client: Client, channelID: string, msgContent: MessageContent) {
    logger.info('The cronjob is scheduled.');
    cron.schedule(config.REMINDER_TIME, () => {
      if (client) {
        client.createMessage(channelID, msgContent);
      } else {
        logger.error('Channel not found. Please check the CHANNEL_ID.');
      }
    });
  }
}
