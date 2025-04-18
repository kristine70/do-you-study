import * as Sqlite3 from 'better-sqlite3';
import {logger} from '../utils/logger';
import {connectDB} from '../utils/database';
import {stringfyTime} from '../utils/date';

class MembersService {
  private db: Sqlite3.Database;
  private stmts: {
    upsert: Sqlite3.Statement;
    delete: Sqlite3.Statement;
    fetchAll: Sqlite3.Statement;
  };

  constructor(db?: Sqlite3.Database) {
    this.db = db ?? connectDB();
    this.stmts = {
      upsert: this.db.prepare(`
        INSERT INTO core_members (user_id, user_name, last_vc_time)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          last_vc_time = excluded.last_vc_time,
          user_name    = excluded.user_name
      `),
      delete: this.db.prepare(`
        DELETE FROM core_members WHERE user_id = ?
      `),
      fetchAll: this.db.prepare(`
        SELECT user_id, last_vc_time FROM core_members
      `),
    };
  }

  public upsert(userId: string, userName: string | undefined, lastVCTime: Date) {
    const iso = stringfyTime(lastVCTime);
    try {
      if (!userId || !userName || !(lastVCTime instanceof Date))
        throw new Error(`upsertMember invalid args: ${userId}, ${userName}, ${iso}`);

      const info = this.stmts.upsert.run(userId, userName, iso);
      if (info.changes === 0) throw new Error('Nothing changed!');
      else logger.info(`[Upsert ${info.changes}] success: id=${userId}`);
    } catch (error) {
      logger.error(`[Upsert] failed for ${userId}: ${(error as Error).message}`);
    }
  }

  public delete(userId: string) {
    try {
      if (!userId) throw new Error(`invalid userId: ${userId}`);

      const info = this.stmts.delete.run(userId);

      if (info.changes === 0) throw new Error('Nothing changed!');
      else logger.info(`[Delete ${info.changes}] success: id=${userId}`);
    } catch (error) {
      logger.error(`[Delete] failed for ${userId}: ${(error as Error).message}`);
    }
  }

  public fetchAll() {
    let result: {user_id: string; last_vc_time: string}[] = [];
    try {
      result = this.stmts.fetchAll.all() as {user_id: string; last_vc_time: string}[];
    } catch (error) {
      logger.error(`[fetchAll] failed: ` + (error as Error).message);
    }
    return result;
  }
}

export default new MembersService();
