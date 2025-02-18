/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from '@prisma/client';
import ApiError from '../errors/apiError';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkUsers = async () => {
  try {
    const tableInfo = await prisma.$queryRaw`
      PRAGMA table_info('user');
    `;

    console.log('Table Info:', tableInfo);

    const users = await prisma.user.findMany();

    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log('Users found:', users);
    }

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error fetching users');
  }
};

const initializeDB = async (): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    // checkUsers();
  } catch (error) {
    throw new ApiError(500, 'Error connecting to the database');
  }
};

export { prisma, initializeDB };
