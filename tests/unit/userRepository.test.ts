import { PrismaClient } from '@prisma/client';
import userRepository from '../../src/repositories/userRepository';
import ApiError from '../../src/errors/apiError';
import { SignUpPayload } from '../../src/types/payloads';

jest.mock('@prisma/client', () => {
  const mockUser = {
    create: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => ({
      user: mockUser,
    })),
  };
});

describe('userRepository.createUser', () => {
  const validSignUpData: SignUpPayload = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    createdDate: '2025-02-18',
    userType: 'student',
  };

  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user successfully', async () => {
    const mockCreateUser = (prisma.user.create as jest.Mock);

    mockCreateUser.mockResolvedValue({
      ...validSignUpData,
      userId: 1,
    });

    await userRepository.createUser(validSignUpData);

    expect(mockCreateUser).toHaveBeenCalledWith({
      data: validSignUpData,
    });
  });

  it('should throw an ApiError if user creation fails', async () => {
    const mockCreateUser = (prisma.user.create as jest.Mock);

    const errorMessage = 'Database error';

    mockCreateUser.mockRejectedValue(new Error(errorMessage));

    await expect(userRepository.createUser(validSignUpData)).rejects.toThrow(
      new ApiError(500, errorMessage),
    );
  });
});
