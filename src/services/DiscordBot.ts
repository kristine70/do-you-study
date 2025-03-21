import { Client, Constants } from 'eris';
import dotenv from 'dotenv';
import config from '../config';
import { connectDB } from '../db/db';
import { logger } from '../utils/logger';
import CronJobReminder from './CronJobReminder';
import GuildMembers from '../db/MembersService';
import dayjs from 'dayjs';

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
    });

    this.updateMember(bot);

    await bot.connect();
    CronJobReminder.schedule(bot);
  }
  updateMember(bot: Client) {
    bot.on('guildMemberAdd', (_guild, member) =>
      GuildMembers.AddOneMember(
        member.user.id,
        new Date(member.joinedAt || Date.now()),
      ),
    );
    bot.on('guildMemberRemove', (_guild, member) =>
      GuildMembers.DeleteOneMember(member.user.id),
    );
    bot.on('voiceChannelJoin', (member) =>
      this.updateLastVCTime(member.user.id, 'Voice Join'),
    );
    bot.on('voiceChannelSwitch', (member) =>
      this.updateLastVCTime(member.user.id, 'Voice Switch'),
    );
    bot.on('voiceChannelLeave', (member) =>
      this.updateLastVCTime(member.user.id, 'Voice Leave'),
    );
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
  async updateLastVCTime(id: string, type: string) {
    const lastTime = await GuildMembers.GetOneLastVCTime(id);
    const now = new Date();
    if (dayjs(lastTime).isBefore(dayjs(now))) {
      await GuildMembers.UpdateLastVCTime(id, now);
      logger.info(`Update Last VC Time [${type}]: id=${id}`);
    } else {
      logger.info(`Action Before Day Off [${type}]: id=${id}`);
    }
  }
}
