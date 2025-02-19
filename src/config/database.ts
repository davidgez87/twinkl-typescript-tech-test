import { PrismaClient } from '@prisma/client';
import ApiError from '../errors/apiError';
import logger from '../logger/pino';

const prisma = new PrismaClient();

const initializeDB = async (): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database Initilized');
  } catch (error) {
    throw new ApiError(500, 'Error connecting to the database');
  }
};

export { prisma, initializeDB };
