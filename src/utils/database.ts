import * as Sqlite3 from 'better-sqlite3';
import * as dotenv from 'dotenv';

dotenv.config();

import {logger} from './logger';
import {exit} from 'node:process';

export interface MembersDbSchema {
  user_id: string;
  user_name: string;
  last_vc_time: string;
}

export const connectDB = () => {
  try {
    const db: Sqlite3.Database = new Sqlite3(process.env.SQLITE_FILE, {
      fileMustExist: true,
    });

    logger.info(`======= SQLite DB Connected: ${process.env.SQLITE_FILE} =======`);
    return db;
  } catch (err) {
    logger.error('SQLite Connection Error:', err);
    exit(1);
  }
};

export const initTheDB = () => {
  const db: Sqlite3.Database = new Sqlite3(process.env.SQLITE_FILE);

  const createTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS core_members (
      user_id TEXT UNIQUE PRIMARY KEY NOT NULL,
      user_name TEXT NOT NULL,
      last_vc_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  createTable.run();
  db.close();
};
