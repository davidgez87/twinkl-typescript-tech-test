import { initializeDB, prisma } from '../../src/config/database';

describe('Database Initialization', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should initialize the database without errors', async () => {
    await expect(initializeDB()).resolves.not.toThrow();
  });

  test('should throw an error if the database connection fails', async () => {
    jest.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('Mock error'));

    await expect(initializeDB()).rejects.toThrow('Error connecting to the database');
  });
});
