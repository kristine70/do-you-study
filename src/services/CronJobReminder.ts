import { Client, MessageContent } from 'eris';
import cron from 'node-cron';
import { logger } from '../utils/logger';
import config from '../config';
import reminderMessage from './ReminderMessage';

class CronJobReminder {
  schedule(client: Client) {
    logger.info('The Cronjob Scheduled Successfully.');
    cron.schedule(
      config.BOT_REMINDER_TIME,
      () => reminderMessage.SendRemindMessage(client),
      { timezone: config.LOCAL_TIMEZONE },
    );
  }
}

export default new CronJobReminder();
