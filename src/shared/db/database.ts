import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME, SCHEMA_SQL } from './schema';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise){
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (db) => {
      await db.execAsync(SCHEMA_SQL);
      return db;
    });
  }
  return dbPromise
}
