import dayjs from 'dayjs';
import config from '../config';
import GuildMembers, { MembersDbSchema } from '../db/MembersService';
import { Client } from 'eris';
import { logger } from '../utils/logger';

const T = (t: dayjs.Dayjs) => t.format(config.DATE_FORMAT);

const messageContent = (
  mentions: string[],
) => `### 你已经有一周没有来学习啦❗️❗️❗️
学习目标都完成了吗？已经可以做到很好的自律了吗？
${mentions.join(' ')}

是否需要帮助或有任何疑问呢？欢迎随时聊天反馈～ 如果未来 7 天内仍未参与__学习房间__，将会被移出小组。以后可以随时重新加入！感谢你的理解与支持！
-# 请假方式： 修改昵称，加上请假结束日期（如：xx-请假到12/02），bot会从请假结束日开始统计。`;

const filterRemindIdList = (list: MembersDbSchema[], days: number) =>
  list
    .filter(
      (m) => T(dayjs().subtract(days, 'day')) === T(dayjs(m.last_vc_time)),
    )
    .map((m) => m.user_id);

class ReminderMessage {
  async SendRemindMessage(bot: Client) {
    const { days7, days14 } = await this.GetRemindList();
    logger.info(`7 days List: [${days7.toString()}]`);
    logger.info(`14 days List: [${days14.toString()}]`);

    if (days7.length > 0) await this.sendOnePublicReminderMessage(bot, days7);

    if (days14.length > 0) {
      const mentions14 =
        '## 14 Days\n' + days14.map((id) => `<@${id}>`).join(' ');
      await this.createOneDiscordMessage(
        bot,
        mentions14,
        days14,
        config.MANAGER_CHANNEL_ID,
      );
    }
  }
  async GetRemindList() {
    const list = (await GuildMembers.GetUnRetireList()) || [];
    return {
      days7: filterRemindIdList(list, config.REMINDER_DAYS),
      days14: filterRemindIdList(list, config.KICK_DAYS),
    };
  }
  async sendOnePublicReminderMessage(bot: Client, mentionList: string[]) {
    const messageMentionContent = mentionList.map((id) => `<@${id}>`);
    if (mentionList.length > 0) {
      await this.createOneDiscordMessage(
        bot,
        messageContent(messageMentionContent),
        mentionList,
        config.MANAGER_CHANNEL_ID,
      );
    }
  }
  async createOneDiscordMessage(
    bot: Client,
    messageContent: string,
    users: string[],
    reminderChannelId: string,
  ) {
    try {
      await bot.createMessage(reminderChannelId, {
        content: messageContent,
        allowedMentions: { users: users },
      });
    } catch (error) {
      logger.error('Message Send', error);
    }
  }
}

export default new ReminderMessage();
