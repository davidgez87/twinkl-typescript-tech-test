import { PrismaClient } from '@prisma/client';
import { SignUpPayload } from '../types/payloads';
import ApiError from '../errors/apiError';

const prisma = new PrismaClient();

const createUser = async (data: SignUpPayload) => {
  try {
    await prisma.user.create({ data });
  } catch (error: any) {
    throw new ApiError(500, error.message);
  }
};

const getUserById = async (userId: number) => {
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
