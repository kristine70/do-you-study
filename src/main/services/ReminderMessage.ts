import dayjs from 'dayjs';
import config from '../config';
import GuildMembers from '../db/MembersService';
import { Client, MessageContent } from 'eris';
import { logger } from '../utils/logger';

const T = (t: dayjs.Dayjs) => t.format(config.DATE_FORMAT);

class ReminderMessage {
  async SendRemindMessage(bot: Client) {
    const { days7, days14 } = await this.GetRemindList();
    const mentions = days7.map((id) => `<@${id}>`);

    const messageContent = `**你已经有一周没有来学习啦❗️❗️❗️**
> 是否需要帮助或有任何疑问呢？欢迎随时聊天反馈～
${mentions.join(' ')}
如果未来 7 天内仍未参与__学习房间__，将会被移出小组。
以后可以随时重新加入！感谢你的理解与支持！
-# bot 测试中🥹，可能有bug，欢迎提。`;

    if (days7.length > 0) {
      bot.createMessage(config.REMINDER_CHANNEL_ID, {
        content: messageContent,
        allowedMentions: { users: days7 },
      });
      logger.info(`Reminder List: ${days7.toString()}`);
    }

    if (days14.length > 0) {
      bot.createMessage(config.MANAGER_CHANNEL_ID, {
        content: days14.map((id) => `<@${id}>`).join(' '),
        allowedMentions: { users: days14 },
      });
    }
  }
  async GetRemindList() {
    const list = (await GuildMembers.GetUnRetireList()) || [];
    const days7 = list
      .filter(
        (m) =>
          T(dayjs().subtract(config.REMINDER_DAYS, 'day')) ===
          T(dayjs(m.last_vc_time)),
      )
      .map((m) => m.user_id);
    const days14 = list
      .filter(
        (m) =>
          T(dayjs().subtract(config.KICK_DAYS, 'day')) ===
          T(dayjs(m.last_vc_time)),
      )
      .map((m) => m.user_id);
    return { days7, days14 };
  }
}

const reminderMessage = new ReminderMessage();
export default reminderMessage;
