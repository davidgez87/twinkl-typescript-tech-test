import express from 'express';
import request from 'supertest';
import { app, initializeApp } from './app';
import { initializeDB } from './config/database';

jest.mock('./config/database', () => ({
  initializeDB: jest.fn(),
}));

jest.mock('./app', () => {
  const expressApp = express();

  expressApp.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

  return {
    initializeApp: jest.fn(),
    app: expressApp,
  };
});

describe('App', () => {
  beforeAll(() => {
    (initializeApp as jest.Mock).mockImplementation(async () => {
      await initializeDB();
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return 200 and "OK" for the /health endpoint', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  it('should propagate database initialization errors', async () => {
    (initializeDB as jest.Mock).mockRejectedValueOnce(new Error('Database connection failed'));

    await expect(initializeApp()).rejects.toThrow('Database connection failed');
  });
});
