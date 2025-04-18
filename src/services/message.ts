import {Guild, GuildMember, TextChannel} from 'discord.js';
import {BotClient} from './bot';
import {logger} from '../utils/logger';
import guildMemberService from './member';
import {beforeXdays, parseTime} from '../utils/date';
import config from '../config';
const {REMINDER_DAYS, KICK_DAYS} = config;

interface IListObj {
  list7: string[];
  list14: string[];
}

const checkUserState = (user: GuildMember) => {
  if (user.user.bot) return false;
  if (user.roles.cache.some((role) => role.name.toLowerCase() === 'study_star')) return false;

  return true;
};

const fetchMembersInfo = async (guild: Guild, userIds: string[]) => {
  let members: Map<string, GuildMember> = new Map();
  try {
    members = await guild.members.fetch({user: userIds});
    const missing = userIds.filter((id) => !members.has(id));
    if (missing.length) logger.warn(`Could not find members for IDs: ${missing.join(', ')}`);
  } catch (err) {
    logger.error(`Failed to fetch members`, err);
  }
  return members ?? [];
};

const getLists = async (guild: Guild) => {
  const list = guildMemberService.fetchAll();
  const result: IListObj = {list7: [], list14: []};

  const list7Result = await fetchMembersInfo(
    guild,
    list.filter((i) => beforeXdays(parseTime(i.last_vc_time), REMINDER_DAYS)).map((i) => i.user_id),
  );
  const list14Result = await fetchMembersInfo(
    guild,
    list.filter((i) => beforeXdays(parseTime(i.last_vc_time), KICK_DAYS)).map((i) => i.user_id),
  );
  list7Result.forEach((member) => {
    if (checkUserState(member)) result.list7.push(member.id);
  });
  list14Result.forEach((member) => {
    if (checkUserState(member)) result.list14.push(member.id);
  });

  return result;
};

const sendMessage = async (channel: TextChannel, userIds: string[], content: string) => {
  try {
    await channel.send({content, allowedMentions: {users: userIds}});
  } catch (error) {
    logger.error('[SEND MESSAGE] fail:', error);
  }
};

export const SendRemindMessage = async (bot: BotClient) => {
  const {list7, list14} = await getLists(bot.guildInstance);
  void sendMessage(bot.managerChannel, list7, config.MESSAGE_CONTENT(list7));
  void sendMessage(bot.managerChannel, list14, list14.map((id) => `<@${id}>`).join(' ')); //* change to the public channel

  logger.info(`======log======`);
  logger.info(`- 7 days : ${JSON.stringify(list7)}`);
  logger.info(`- 14 days: ${JSON.stringify(list14)}`);
};
