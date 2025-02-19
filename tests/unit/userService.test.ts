import bcrypt from 'bcrypt';
import { signUpUserService, userDetailsService } from '../../src/services/userService';
import userRepository from '../../src/repositories/userRepository';
import ApiError from '../../src/errors/apiError';
import { SignUpPayload } from '../../src/types/payloads';

jest.mock('bcrypt');
jest.mock('../../src/repositories/userRepository');

describe('signUpUserService', () => {
  const validSignUpData: SignUpPayload = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    createdDate: '2025-02-18',
    userType: 'student',
  };

  it('should successfully hash the password and create the user', async () => {
    const hashedPassword = 'hashedPassword';

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    (userRepository.createUser as jest.Mock).mockResolvedValue(undefined);

    await signUpUserService(validSignUpData);

    expect(bcrypt.hash).toHaveBeenCalledWith(validSignUpData.password, 10);
    expect(userRepository.createUser).toHaveBeenCalledWith({
      ...validSignUpData,
      password: hashedPassword,
    });
  });

  it('should throw an ApiError when there is an error during password hashing', async () => {
    const errorMessage = 'Error hashing password';

    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(signUpUserService(validSignUpData)).rejects.toThrow(
      new ApiError(500, errorMessage),
    );
  });

  it('should throw an ApiError when userRepository.createUser fails', async () => {
    const hashedPassword = 'hashedPassword';

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    const createUserErrorMessage = 'Error creating user';

    (userRepository.createUser as jest.Mock).mockRejectedValue(new Error(createUserErrorMessage));

    await expect(signUpUserService(validSignUpData)).rejects.toThrow(
      new ApiError(500, createUserErrorMessage),
    );
  });
});

describe('userDetailsService', () => {
  it('should return user details when a valid userId is provided', async () => {
    const mockUser = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
    };

    (userRepository.getUserById as jest.Mock).mockResolvedValue(mockUser);

    const user = await userDetailsService(1);

    expect(user).toEqual(mockUser);
    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
  });

  it('should throw an ApiError when userRepository.getUserById fails', async () => {
    const errorMessage = 'Database error';

    (userRepository.getUserById as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(userDetailsService(1)).rejects.toThrow(new ApiError(500, errorMessage));
  });
});
