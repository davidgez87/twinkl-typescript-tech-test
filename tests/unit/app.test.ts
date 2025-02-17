// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { app, initializeApp } from '../../src/app';
import { initializeDB } from '../../src/config/database';

jest.mock('../../src/config/database', () => ({
  initializeDB: jest.fn(),
}));

describe('App', () => {
  beforeAll(async () => {
    (initializeDB as jest.Mock).mockResolvedValue(undefined);
    await initializeApp();
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
