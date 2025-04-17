import {Client, TextChannel} from 'discord.js';
import config from '../config';
import {logger} from '../utils/logger';

const CHANNEL_ID = config.MANAGER_CHANNEL_ID;

//* pass test
export const sendMessage = async (bot: Client, userIds: string[]) => {
  try {
    const channel = await bot.channels.fetch(CHANNEL_ID);
    if (!(channel instanceof TextChannel)) throw new Error(`Channel ${channel?.id} is not valid`);

    const content = config.MESSAGE_CONTENT(userIds);

    await channel.send({content, allowedMentions: {users: userIds}});
  } catch (error) {
    logger.error('[SEND MESSAGE] fail:', error);
  }
};

// async SendRemindMessage(bot: Client) {
//   const { days7, days14 } = await this.GetRemindList();
//   logger.info(` 7 days List: ${JSON.stringify(days7)}`);
//   logger.info(`14 days List: ${JSON.stringify(days14)}`);

//   if (days7.length > 0) await this.sendOnePublicReminderMessage(bot, days7);

//   if (days14.length > 0) {
//     const mentions14 =
//       '## 14 Days\n' + days14.map((id) => `<@${id}>`).join(' ');
//     await this.createOneDiscordMessage(
//       bot,
//       mentions14,
//       days14,
//       config.MANAGER_CHANNEL_ID,
//     );
//   }
// }
