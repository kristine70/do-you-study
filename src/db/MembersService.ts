import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import config from '../config';

export interface MembersDbSchema extends Document {
  user_id: string;
  last_vc_time: NativeDate;
  day_off: NativeDate;
  retire: boolean;
}

const membersSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  last_vc_time: { type: Date, required: true, default: new Date() },
  day_off: { type: Date, default: new Date(config.DEFAULT_DATE) },
  retire: { type: Boolean, required: true, default: false },
});
membersSchema.index({ user_id: 'text' }, { unique: true });
const MemberDbApi = mongoose.model<MembersDbSchema>('main_db', membersSchema);

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
  async DeleteOneMember(user_id: string) {
    try {
      await MemberDbApi.deleteOne({ user_id });
    } catch (error) {
      logger.error(`DeleteOneMember Error: ${JSON.stringify(error)}`);
    }
  }
  async GetUnRetireList() {
    let list: MembersDbSchema[] | null = [];
    try {
      list = await MemberDbApi.find({ retire: false });
    } catch (error) {
      logger.error(`GetUnRetireList Error: ${JSON.stringify(error)}`);
    }
    return list || [];
  }
  async GetOneLastVCTime(id: string) {
    let member: MembersDbSchema | null = null;
    try {
      member = await MemberDbApi.findOne({ user_id: id });
    } catch (error) {
      logger.error(
        `OneLastVCTime Find Error: id=${id} ${JSON.stringify(error)}`,
      );
    }
    return member?.last_vc_time || new Date(config.DEFAULT_DATE);
  }
}
const GuildMembers = new MembersService();
export default GuildMembers;
