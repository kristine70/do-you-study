import {Client, GatewayIntentBits, Events, Guild, TextChannel, Snowflake} from 'discord.js';
import {logger} from '../utils/logger';
import guildMemberService from './member';
const {SERVER_ID, CHANNEL_MANAGER_ID, CHANNEL_PUBLIC_ID} = process.env as Record<string, Snowflake>;
const clientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
};

export class BotClient extends Client {
  private guildInstance!: Guild;
  private managerChannel!: TextChannel;
  private announcementsChannel!: TextChannel;

  constructor() {
    super(clientOptions);
    this.registerEvents();
  }

  private async onReady() {
    logger.info(`Logged in as ${this.user?.tag}!`);

    this.guildInstance = await this.guilds.fetch(SERVER_ID);
    if (!(this.guildInstance instanceof Guild)) throw new Error(`GuildInstance Fetch Error!`);

    this.managerChannel = await this.fetchTextChannel(CHANNEL_MANAGER_ID);
    this.announcementsChannel = await this.fetchTextChannel(CHANNEL_PUBLIC_ID);

    logger.info(`✅ Ready: ${JSON.stringify(this.guildInstance.name)}`);
  }

  private async fetchTextChannel(id: string): Promise<TextChannel> {
    const ch = await this.channels.fetch(id);
    if (!ch || !(ch instanceof TextChannel)) throw new Error(`Channel ${id} is not a TextChannel.`);
    return ch;
  }

  private registerEvents(): void {
    this.on(Events.ClientReady, () => void this.onReady());

    this.on(Events.GuildMemberAdd, (member) => {
      if (member.user.bot) return;
      logger.info(`---- Member Add: id=${member.id} name=${member.displayName}`);
      guildMemberService.upsert(member.id, member.displayName, new Date());
    });
    this.on(Events.GuildMemberRemove, (member) => {
      logger.info(`---- Member Delete: id=${member.id} name=${member.displayName}`);
      guildMemberService.delete(member.id);
    });
    this.on(Events.VoiceStateUpdate, (oldState, newState) => {
      if (newState.member?.user.bot) return;
      logger.info(`---- Member Update: id=${newState.id} name=${newState.member?.displayName}`);
      guildMemberService.upsert(newState.id, newState.member?.displayName, new Date());
    });
  }
}
