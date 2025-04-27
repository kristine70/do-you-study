import {
  Client,
  GatewayIntentBits,
  Events,
  Guild,
  TextChannel,
  Snowflake,
  GuildMember,
} from 'discord.js';
import {logger} from '../utils/logger';
import guildMemberService from './member';
import config from '../config';
import * as cron from 'node-cron';
import {SendRemindMessage} from './message';
const {SERVER_ID, CHANNEL_MANAGER_ID, CHANNEL_PUBLIC_ID} = process.env as Record<string, Snowflake>;
const clientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
};

export class BotClient extends Client {
  public guildInstance!: Guild;
  public managerChannel!: TextChannel;
  public announcementsChannel!: TextChannel;

  constructor() {
    super(clientOptions);
    this.registerEvents();
  }

  private async onReady() {
    this.guildInstance = await this.guilds.fetch(SERVER_ID);
    this.managerChannel = (await this.channels.fetch(CHANNEL_MANAGER_ID)) as TextChannel;
    this.announcementsChannel = (await this.channels.fetch(CHANNEL_PUBLIC_ID)) as TextChannel;

    cron.schedule(config.BOT_REMINDER_TIME, () => void SendRemindMessage(this), {
      timezone: config.LOCAL_TIMEZONE,
    });

    logger.info(`✅ Ready: ${JSON.stringify(this.guildInstance.name)}`);
  }

  private registerEvents(): void {
    this.on(Events.ClientReady, () => void this.onReady());

    this.on(Events.GuildMemberAdd, (member) => {
      if (member.user.bot) return;
      logger.info(`---- Add ----`);
      guildMemberService.upsert(member.id, member.displayName, new Date());
    });
    this.on(Events.GuildMemberRemove, (member) => {
      logger.info(`---- Member Delete: name=${member.displayName} ----`);
      guildMemberService.delete(member.id);
    });
    this.on(Events.VoiceStateUpdate, (oldState, newState) => {
      if (newState.member?.user.bot) return;
      logger.info(`---- Update ----`);
      guildMemberService.upsert(newState.id, newState.member?.displayName, new Date());
    });
  }

  public async initMemberDB() {
    try {
      const list: Map<string, GuildMember> = await this.guildInstance.members.fetch();
      const date = new Date();
      list.forEach(({id, displayName, user}) => {
        if (user.bot) return;
        guildMemberService.upsert(id, displayName, date);
      });
    } catch (error) {
      logger.error('initMemberDB:', error);
    }
  }
}
