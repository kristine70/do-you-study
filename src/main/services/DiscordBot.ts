import { Client, Constants } from 'eris';
import dotenv from 'dotenv';
import config from '../config';
import { connectDB } from '../db/db';
import { logger } from '../utils/logger';
import MembersDB from '../db/MembersService';
import CronJobReminder from './CronJobReminder';

dotenv.config();

export default class DiscordBot {
  async run() {
    await connectDB();
    const memberDb = new MembersDB();
    const reminder = new CronJobReminder();

    const bot = new Client(process.env.TOKEN!, {
      intents: [Constants.Intents.all],
    });

    bot.on('ready', () => {
      logger.info('=============== Bot is ready! ==============');
      reminder.schedule(bot, config.REMINDER_CHANNEL_ID, 'This is a test msg');
    });

    bot.on('error', (err: any) => {
      logger.error(`[Bot Error] ${err}`);
    });

    this.updateMember(bot, memberDb);

    bot.connect();
  }
  updateMember(bot: Client, Member: MembersDB) {
    bot.on('guildMemberAdd', async (_guild, member) => {
      const time = new Date(member.joinedAt || Date.now());
      await Member.AddOneMember(member.user.id, time);
      logger.info(
        `Member added successfully: id=${member.user.id} time=${time.toJSON()}`,
      );
    });

    bot.on('voiceChannelJoin', async (member) => {
      const time = new Date();
      await Member.UpdateLastVCTime(member.user.id, time);
      logger.info(`VC Join: ${member.user.id} ${time.toJSON()}`);
    });
    bot.on('voiceChannelSwitch', async (member) => {
      const time = new Date();
      await Member.UpdateLastVCTime(member.user.id, time);
      logger.info(`VC Switch: ${member.user.id} ${time.toJSON()}`);
    });
    bot.on('voiceChannelLeave', async (member) => {
      const time = new Date();
      await Member.UpdateLastVCTime(member.user.id, time);
      logger.info(`VC Leave: ${member.user.id} ${time.toJSON()}`);
    });
  }
  async initMemberDB(bot: Client, Member: MembersDB) {
    try {
      const guild = bot.guilds.find((g) => g.id == config.SERVER_ID);
      await guild!.fetchAllMembers();
      const date = new Date();
      guild!.members.forEach(async (m) => {
        await Member.AddOneMember(m.id, date);
      });
    } catch (error) {
      logger.error(`Guilds Find Error: ${error}`);
    }
  }
}
