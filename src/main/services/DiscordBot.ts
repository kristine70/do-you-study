import { Client, Constants } from 'eris';
import dotenv from 'dotenv';
import config from '../config';
import { connectDB } from '../db/db';
import { logger } from '../utils/logger';
import CronJobReminder from './CronJobReminder';
import GuildMembers from '../db/MembersService';
// import ReminderMessage from './ReminderMessage';

dotenv.config();

export default class DiscordBot {
  async run() {
    await connectDB();

    const bot = new Client(process.env.TOKEN!, {
      intents: [Constants.Intents.all],
    });

    bot.on('error', (err: any) => logger.error(`Bot ${err}`));
    bot.on('ready', () => {
      logger.debug('Bot is ready! ');
      // ReminderMessage.sendOneMessage(bot);
    });

    this.updateMember(bot);

    await bot.connect();
    CronJobReminder.schedule(bot);
  }
  updateMember(bot: Client) {
    bot.on('guildMemberAdd', async (_guild, member) => {
      const time = new Date(member.joinedAt || Date.now());
      await GuildMembers.AddOneMember(member.user.id, time);
      logger.info(`Member added successfully: id=${member.user.id}`);
    });
    bot.on('guildMemberRemove', async (_guild, member) => {
      await GuildMembers.DeleteOneMember(member.user.id);
      logger.info(`Member deleted successfully: id=${member.user.id}`);
    });

    bot.on('voiceChannelJoin', async (member) => {
      await GuildMembers.UpdateLastVCTime(member.user.id, new Date());
      logger.info(`VC Join: ${member.user.id}`);
    });
    bot.on('voiceChannelSwitch', async (member) => {
      await GuildMembers.UpdateLastVCTime(member.user.id, new Date());
      logger.info(`VC Switch: ${member.user.id}`);
    });
    bot.on('voiceChannelLeave', async (member) => {
      await GuildMembers.UpdateLastVCTime(member.user.id, new Date());
      logger.info(`VC Leave: ${member.user.id}`);
    });
  }
  async initMemberDB(bot: Client) {
    try {
      const guild = bot.guilds.find((g) => g.id == config.SERVER_ID);
      await guild!.fetchAllMembers();
      const date = new Date();
      guild!.members.forEach(async (m) => {
        if (!m.bot) {
          await GuildMembers.AddOneMember(m.id, date);
        }
      });
    } catch (error) {
      logger.error(`Guilds Find Error: ${error}`);
    }
  }
}
