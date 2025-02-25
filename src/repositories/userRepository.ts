import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SignUpPayload } from '../types/request';
import { DatabaseResponse } from '../types/response';
import ApiError from '../errors/apiError';

const prisma = new PrismaClient();

const createUser = async (data: SignUpPayload): Promise<void> => {
  try {
    await prisma.user.create({ data });
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && Array.isArray(error.meta?.target) && error.meta.target.includes('email')) {
        throw new ApiError(400, 'Email is already taken');
      }
    }

    throw new ApiError(500, error.message);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = async (): Promise<DatabaseResponse[]> => {
  try {
    const users = await prisma.user.findMany();
    console.log('🚀 ~ All Users in DB:', users);
    return users;
  } catch (error: any) {
    console.error('❌ Error fetching all users:', error.message);
    throw new ApiError(500, 'Error fetching all users');
  }
};

const getUserById = async (userId: number): Promise<DatabaseResponse | null> => {
  try {
    return await prisma.user.findUnique({
      where: { userId },
      select: {
        fullName: true,
        email: true,
        createdDate: true,
        userType: true,
      },
    });
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export { createUser, getUserById };
