const Eris = require('eris');
require('dotenv').config();
const bot = new Eris(process.env.TOKEN, { intents: [53608447] });

bot.on('ready', () => console.log('Bot is ready!'));
bot.on('messageCreate', (msg: DiscordMessage) => {
  if (msg.content === '!ping') {
    bot.createMessage(msg.channel.id, 'Pong!');
  }
});

bot.connect();
