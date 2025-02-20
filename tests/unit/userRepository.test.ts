import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createUser, getUserById } from '../../src/repositories/userRepository';
import ApiError from '../../src/errors/apiError';
import { SignUpPayload } from '../../src/types/request';

jest.mock('@prisma/client', () => {
  const mockUser = {
    create: jest.fn(),
    findUnique: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => ({
      user: mockUser,
    })),
  };
});

describe('userRepository', () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const validSignUpData: SignUpPayload = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      createdDate: '2025-02-18',
      userType: 'student',
    };

    it('should create a new user successfully', async () => {
      const mockCreateUser = prisma.user.create as jest.Mock;

      mockCreateUser.mockResolvedValue({
        ...validSignUpData,
        userId: 1,
      });

      await createUser(validSignUpData);

      expect(mockCreateUser).toHaveBeenCalledWith({
        data: validSignUpData,
      });
    });

    it('should throw an ApiError if email is already taken', async () => {
      const mockCreateUser = prisma.user.create as jest.Mock;

      const uniqueConstraintError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        { code: 'P2002', meta: { target: ['email'] }, clientVersion: '4.0.0' },
      );

      mockCreateUser.mockRejectedValue(uniqueConstraintError);

      await expect(createUser(validSignUpData)).rejects.toThrow(
        new ApiError(400, 'Email is already taken'),
      );
    });

    it('should throw an ApiError if user creation fails', async () => {
      const mockCreateUser = prisma.user.create as jest.Mock;
      const errorMessage = 'Database error';

      mockCreateUser.mockRejectedValue(new Error(errorMessage));

      await expect(createUser(validSignUpData)).rejects.toThrow(
        new ApiError(500, errorMessage),
      );
    });
  });

  describe('getUserById', () => {
    it('should return user details when a valid userId is provided', async () => {
      const mockUser = {
        fullName: 'John Doe',
        email: 'john@example.com',
        createdDate: '2025-02-18',
        userType: 'student',
      };

      const mockFindUnique = prisma.user.findUnique as jest.Mock;
      mockFindUnique.mockResolvedValue(mockUser);

      const user = await getUserById(1);

      expect(user).toEqual(mockUser);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { userId: 1 },
        select: {
          fullName: true,
          password: true,
          email: true,
          createdDate: true,
          userType: true,
        },
      });
    });

    it('should return null if user is not found', async () => {
      const mockFindUnique = prisma.user.findUnique as jest.Mock;
      mockFindUnique.mockResolvedValue(null);

      const user = await getUserById(999);

      expect(user).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { userId: 999 },
        select: {
          fullName: true,
          password: true,
          email: true,
          createdDate: true,
          userType: true,
        },
      });
    });

    it('should throw an ApiError if fetching user fails', async () => {
      const errorMessage = 'Database error';
      const mockFindUnique = prisma.user.findUnique as jest.Mock;
      mockFindUnique.mockRejectedValue(new Error(errorMessage));

      await expect(getUserById(1)).rejects.toThrow(
        new ApiError(500, errorMessage),
      );
    });
  });
});
