import {Client, GatewayIntentBits, Events} from 'discord.js';
import * as dotenv from 'dotenv';
import {logger} from '../utils/logger';
import {exit} from 'node:process';
import guildMemberService from './member';

dotenv.config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

export function startBot() {
  bindMemeberEvents(bot);

  bot.login(process.env.TOKEN).catch((error) => {
    logger.error('bot login ERROR!!!', error);
    exit(1);
  });
}

function bindMemeberEvents(bot: Client) {
  // bot login
  bot.on(Events.ClientReady, () => {
    logger.info('Bot login successfully!');
  });
  // member events
  bot.on(Events.GuildMemberAdd, (member) => {
    logger.info(`---- Member Add: id=${member.id} name=${member.displayName}`);
    guildMemberService.upsert(member.id, member.displayName, new Date());
  });
  bot.on(Events.GuildMemberRemove, (member) => {
    logger.info(`---- Member Delete: id=${member.id} name=${member.displayName}`);
    guildMemberService.delete(member.id);
  });
  bot.on(Events.VoiceStateUpdate, (oldState, newState) => {
    logger.info(`---- Member Update: id=${newState.id} name=${newState.member?.displayName}`);
    guildMemberService.upsert(newState.id, newState.member?.displayName, new Date());
  });
}
