import dayjs from 'dayjs';
import config from '../config';
import GuildMembers from '../db/MembersService';
import { Client, MessageContent } from 'eris';
import { logger } from '../utils/logger';

const T = (t: dayjs.Dayjs) => t.format(config.DATE_FORMAT);

const oneMentionList = '';

const messageContent = (
  mentions: string[],
) => `### 你已经有一周没有来学习啦❗️❗️❗️
学习目标都完成了吗？已经可以做到很好的自律了吗？
${mentions.join(' ')}

是否需要帮助或有任何疑问呢？欢迎随时聊天反馈～**如果未来 7 天内仍未参与__学习房间__，将会被移出小组**。以后可以随时重新加入！感谢你的理解与支持！

-# 请假方式： 修改昵称，加上请假结束日期（如：xx-请假到12/02），bot会从请假结束日开始统计。`;

class ReminderMessage {
  async SendRemindMessage(bot: Client) {
    const { days7, days14 } = await this.GetRemindList();
    logger.info(`7days List: ${days7.toString()}
14days List: ${days14.toString()}`);

    if (days7.length > 0) {
      const mentions7 = days7.map((id) => `<@${id}>`);
      await this.createOneDiscordMessage(bot, messageContent(mentions7), days7);
    }

    if (days14.length > 0) {
      const mentions14 =
        '## 14 Days\n' + days14.map((id) => `<@${id}>`).join(' ');
      await this.createOneDiscordMessage(bot, mentions14, days14);
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
  sendOneMessage(bot: Client) {
    const mentionList = oneMentionList.split(',');
    const mentions = mentionList.map((id) => `<@${id}>`);
    if (mentionList.length > 0) {
      this.createOneDiscordMessage(bot, messageContent(mentions), mentionList);
    }
  }
  async createOneDiscordMessage(
    bot: Client,
    messageContent: string,
    users: string[],
  ) {
    try {
      await bot.createMessage(config.REMINDER_CHANNEL_ID, {
        content: messageContent,
        allowedMentions: { users: users },
      });
    } catch (error) {
      logger.error('Message Send', error);
    }
  }
}

export default new ReminderMessage();
