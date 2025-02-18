import sqlite3 from 'sqlite3';

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
      email TEXT UNIQUE NOT NULL,
      user_type TEXT CHECK(user_type IN ('student', 'teacher', 'parent', 'private tutor')) NOT NULL
    );
  `, (error) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
});
