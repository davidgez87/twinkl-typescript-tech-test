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

const getUserById = async (userId: number): Promise<DatabaseResponse | null> => {
  try {
    return await prisma.user.findUnique({
      where: { userId },
      select: {
        fullName: true,
        password: true,
        email: true,
        createdDate: true,
        userType: true,
      },
    });
  } catch (error: any) {
    throw new ApiError(500, error.message);
  }
};

export { createUser, getUserById };
