import sqlite3 from 'sqlite3';
import { connectDB, initializeDB } from '../../src/config/database';

jest.mock('sqlite3', () => {
  const mockRun = jest.fn((query: string, callback: (err: Error | null) => void) => callback?.(query.includes('ERROR_CASE') ? new Error('Mocked database error') : null));

  return {
    Database: jest.fn(() => ({
      run: mockRun,
      close: jest.fn((callback?: (err: Error | null) => void) => callback?.(null)),
    })),
  };
});

describe('Database Connection', () => {
  it('should return a valid database instance', () => {
    const db = connectDB();
    expect(db).toBeDefined();
    expect(sqlite3.Database).toHaveBeenCalledWith('./database.sqlite', expect.any(Function));
  });
});

describe('Database Initialization', () => {
  it('should create the users table successfully', async () => {
    await expect(initializeDB()).resolves.toBeUndefined();
  });

  it('should handle database errors', async () => {
    (sqlite3.Database as unknown as jest.Mock).mockImplementationOnce(() => ({
      run: (query: string, callback: (err: Error | null) => void) => {
        callback(new Error('Test DB error'));
      },
    }));

    await expect(initializeDB()).rejects.toThrow('Test DB error');
  });
});
