// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from '@prisma/client';
import { SignUpPayload } from '../types/payloads';
import ApiError from '../errors/apiError';

const prisma = new PrismaClient();

const userRepository = {
  createUser: async ({
    fullName,
    email,
    password,
    createdDate,
    userType,
  }: SignUpPayload): Promise<void> => {
    try {
      await prisma.user.create({
        data: {
          fullName,
          email,
          password,
          createdDate,
          userType,
        },
      });
    } catch (error: any) {
      throw new ApiError(500, error.message);
    }
  },
};

export default userRepository;
