import { PrismaClient } from '@prisma/client';
import ApiError from '../errors/apiError';

const prisma = new PrismaClient();

const initializeDB = async (): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    throw new ApiError(500, 'Error connecting to the database');
  }
};

export { prisma, initializeDB };
