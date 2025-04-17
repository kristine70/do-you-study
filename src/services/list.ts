import {Guild, GuildMember} from 'discord.js';
import {logger} from '../utils/logger';

// async GetRemindList() {
//   const list = (await GuildMembers.GetUnRetireList()) || [];
//   return {
//     days7: filterRemindIdList(list, config.REMINDER_DAYS),
//     days14: filterRemindIdList(list, config.KICK_DAYS),
//   };
// }

// const filterRemindIdList = (list: MembersDbSchema[], days: number) =>
//   list
//     .filter(
//       (m) => T(dayjs().subtract(days, 'day')) === T(dayjs(m.last_vc_time)),
//     )
//     .map((m) => m.user_id);

export async function fetchMembersInfo(guild: Guild, userIds: string[]) {
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
