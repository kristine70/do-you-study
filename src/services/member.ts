import * as Sqlite3 from 'better-sqlite3';
import {logger} from '../utils/logger';
import {connectDB} from '../utils/database';
import {stringfyTime} from '../utils/date';

export interface IMembersService {
  upsert(userId: string, userName: string, lastVCTime: Date): void;
  delete(userId: string): void;
}

class MembersService implements IMembersService {
  private db: Sqlite3.Database;
  private stmts: {
    upsert: Sqlite3.Statement;
    delete: Sqlite3.Statement;
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
}

export default new MembersService();
