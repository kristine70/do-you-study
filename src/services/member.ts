import * as Sqlite3 from 'better-sqlite3';
import {logger} from '../utils/logger';
import {connectDB, MembersDbSchema} from '../utils/database';
import {parseTime, stringfyTime} from '../utils/date';

export const db: Sqlite3.Database = connectDB();

/**
 * MembersService class to handle database operations related to members.
 * It provides methods to update, add, delete, and retrieve member information.
 */
class MembersService {
  public updateLastVCTime(user_id: string, lastVCTime: Date): void {
    try {
      const stmt = db.prepare(`UPDATE core_members SET last_vc_time = ? WHERE user_id = ?`);
      stmt.run(stringfyTime(lastVCTime), user_id);
    } catch (error) {
      logger.error(`Update LastVCTime: ${JSON.stringify(error)}`);
    }
  }

  public addOne(user_id: string, user_name: string, lastVCTime: Date): void {
    try {
      const stmt = db.prepare(
        `INSERT INTO core_members (user_id, user_name, last_vc_time) VALUES (?, ?, ?)`,
      );
      stmt.run(user_id, user_name, stringfyTime(lastVCTime));
    } catch (error) {
      logger.error(`Add One Member: ${JSON.stringify(error)}`);
    }
  }

  public delete(user_id: string): void {
    try {
      const stmt = db.prepare(`DELETE FROM core_members WHERE user_id = ?`);
      stmt.run(user_id);
    } catch (error) {
      logger.error(`Delete One Member: ${JSON.stringify(error)}`);
    }
  }

  public getLastVCTime(user_id: string): Date {
    try {
      const stmt = db.prepare(`SELECT last_vc_time FROM core_members WHERE user_id = ?`);
      const row = stmt.get(user_id) as MembersDbSchema;
      if (row && row.last_vc_time) return parseTime(row.last_vc_time);
    } catch (error) {
      logger.error(
        `Get Time Error. Return the CURRENT time for user_id=${user_id}: ${JSON.stringify(error)}`,
      );
    }
    return new Date();
  }
}

export default new MembersService();
