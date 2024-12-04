import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const membersSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  last_vc_time: { type: Date, required: true, default: new Date() },
  day_off: { type: Date, default: new Date('2000-01-01') },
  retire: { type: Boolean, required: true, default: false },
});
membersSchema.index({ user_id: 'text' }, { unique: true });
const MemberDbApi = mongoose.model('main_db', membersSchema);

class MembersService {
  async UpdateLastVCTime(user_id: string, last_vc_time: Date) {
    try {
      await MemberDbApi.findOneAndUpdate({ user_id }, { last_vc_time });
    } catch (error) {
      logger.error(`UpdateLastVCTime Error: ${JSON.stringify(error)}`);
    }
  }
  async AddOneMember(user_id: string, last_vc_time: NativeDate) {
    try {
      await MemberDbApi.create({ last_vc_time, user_id });
    } catch (error) {
      logger.error(`AddOneMember Error: ${JSON.stringify(error)}`);
    }
  }
  async GetUnRetireList() {
    try {
      const list = await MemberDbApi.find({ retire: false });
      return list;
    } catch (error) {
      logger.error(`GetUnRetireList Error: ${JSON.stringify(error)}`);
    }
  }
}
const GuildMembers = new MembersService();
export default GuildMembers;
