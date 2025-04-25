const MESSAGE_CONTENT = (mentions: string[]) => `### 你已经一周没来学习啦❗️❗️❗️
学习目标完成了吗？已经可以很好的自律了吗？如需帮助或有疑问，欢迎随时聊天反馈~
${mentions.map((id) => `<@${id}>`).join(' ')}
**如果未来 7 天内仍未加入过__学习房间__，将会被移出小组。**以后可以随时重新加入！感谢你的理解与支持。
-# 请假方式： 修改昵称，加上请假结束日期，如：xx-请假到12/02，这样就可以啦！在小组待满三个月，将会获得“⭐️Study Star”称号，不会被踢，每月一日结算。`;

export default {
  REMINDER_DAYS: 7,
  KICK_DAYS: 14,
  BOT_REMINDER_TIME: '0 9 * * *',
  MESSAGE_CONTENT,

  LOCAL_TIMEZONE: 'America/Los_Angeles',
};
