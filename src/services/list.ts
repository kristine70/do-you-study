import {Guild, GuildMember} from 'discord.js';
import {logger} from '../utils/logger';
import guildMemberService from './member';
import {beforeXdays, parseTime} from '../utils/date';
import config from '../config';
const {REMINDER_DAYS, KICK_DAYS} = config;

async function fetchMembersInfo(guild: Guild, userIds: string[]) {
  let members: Map<string, GuildMember> = new Map();
  try {
    members = await guild.members.fetch({user: userIds});
    const missing = userIds.filter((id) => !members.has(id));
    if (missing.length) logger.warn(`Could not find members for IDs: ${missing.join(', ')}`);
  } catch (err) {
    logger.error(`Failed to fetch members`, err);
  }
  return members ?? [];
}

const checkUserState = (user: GuildMember) => {
  if (user.user.bot) return false;
  if (user.roles.cache.some((role) => role.name.toLowerCase() === 'star')) {
    return false;
  }
  return true;
};

export const getLists = () => {
  const list = guildMemberService.fetchAll();
  const result = {list7: [], list14: []};

  const list7Result = await fetchMembersInfo(
    list.filter((i) => beforeXdays(parseTime(i.last_vc_time), REMINDER_DAYS)).map((i) => i.user_id),
  );
  const list14Result = await fetchMembersInfo(
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
