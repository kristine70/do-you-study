const MESSAGE_CONTENT = (mentions: string[]) => `### 你已经有一周没有来学习啦❗️❗️❗️
学习目标都完成了吗？已经可以做到很好的自律了吗？是否需要帮助或有任何疑问呢？欢迎随时聊天反馈～
${mentions.map((id) => `<@${id}>`).join(' ')}
如果未来 7 天内仍未参与__学习房间__，将会被移出小组。以后可以随时重新加入！感谢你的理解与支持。
-# 请假方式： 修改昵称，加上请假结束日期（如：xx-请假到12/02），bot会从请假结束日开始统计。
-# 在小组待满三个月，将会获得“⭐️Study Star”称号，不会被踢。`;

export default {
  PUBLIC_REMINDER_CHANNEL_ID: '1291156798207819817',
  MANAGER_CHANNEL_ID: '1290892979665371176',
  SERVER_ID: '1290832699975536660',
  REMINDER_DAYS: 7,
  KICK_DAYS: 14,
  BOT_REMINDER_TIME: '0 9 * * *',
  MESSAGE_CONTENT,

  LOCAL_TIMEZONE: 'America/Los_Angeles',
};
