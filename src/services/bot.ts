import {Client, GatewayIntentBits, Events} from 'discord.js';
import * as dotenv from 'dotenv';
import {logger} from '../utils/logger';
import {exit} from 'node:process';

dotenv.config();

export function startBot() {
  const bot = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  bindMemeberEvents(bot);

  bot.login(process.env.TOKEN).catch((error) => {
    logger.error('bot login ERROR!!!', error);
    exit(1);
  });
}

function bindMemeberEvents(bot: Client) {
  // bot login
  bot.on(Events.ClientReady, () => logger.info('Bot login successfully!'));
  // member events
  bot.on(Events.GuildMemberAdd, (member) => {
    logger.info(`Member added: id=${member.id}`);
  });
  bot.on(Events.GuildMemberRemove, (member) => {
    logger.info(`Member deleted: id=${member.id}`);
  });
  bot.on(Events.VoiceStateUpdate, (oldState, newState) => {
    logger.info(`Member VoiceStateUpdate: id=${newState.id}`);
  });
}
