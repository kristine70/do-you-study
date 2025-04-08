// import {Client} from 'eris';
import * as cron from 'node-cron';
// import {logger} from '../utils/logger';
// import config from '../config';
// import reminderMessage from './ReminderMessage';

import config from '../config';
import {logger} from '../utils/logger';

export default function CronJobSchedule() {
  logger.info('The Cronjob Scheduled Successfully.');
  cron.schedule(config.BOT_REMINDER_TIME, () => {
    logger.info('Cronjob is running');
  });
  // cron.schedule(config.BOT_REMINDER_TIME, () => reminderMessage.SendRemindMessage(client), {
  //   timezone: config.LOCAL_TIMEZONE,
  // });
}
