// eslint-disable-next-line import/no-extraneous-dependencies
import sqlite3 from 'sqlite3'; // TODO - strange import error 'sqlite3' should be listed in the project's dependencies. It is installed as dependancy

export const connectDB = () => new sqlite3.Database('./database.sqlite', (error: any) => {
  if (error) {
    throw error;
  }
});

export const initializeDB = (): Promise<void> => new Promise((resolve, reject) => {
  const db = connectDB();

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      password TEXT NOT NULL,
      created_date TEXT NOT NULL,
      email_address TEXT UNIQUE NOT NULL,
      user_type TEXT CHECK(user_type IN ('student', 'teacher', 'parent', 'private tutor')) NOT NULL
    );
  `, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});
