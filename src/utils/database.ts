import * as Sqlite3 from 'better-sqlite3';
import * as dotenv from 'dotenv';

dotenv.config();

import {logger} from './logger';
import {exit} from 'node:process';

export const connectDB = () => {
  try {
    const db: Sqlite3.Database = new Sqlite3(process.env.SQLITE_FILE, {
      fileMustExist: true,
      verbose: logger.debug,
    });

    logger.info(`======= SQLite DB Connected: ${process.env.SQLITE_FILE} =======`);
    return db;
  } catch (err) {
    logger.error('SQLite Connection Error:', err);
    exit(1);
  }
};

export const initTheDB = () => {
  const db: Sqlite3.Database = new Sqlite3(process.env.SQLITE_FILE, {
    verbose: logger.debug,
  });

  const createTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS core_members (
      user_id TEXT UNIQUE PRIMARY KEY NOT NULL,
      user_name TEXT NOT NULL,
      last_vc_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      study_star BOOLEAN NOT NULL DEFAULT 0
    );
  `);

  createTable.run();
  db.close();
};
