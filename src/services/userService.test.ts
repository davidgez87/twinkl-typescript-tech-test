import { signUpUserService, userDetailsService } from './userService';
import { createUser, getUserById } from '../repositories/userRepository';
import ApiError from '../errors/apiError';
import { SignUpPayload } from '../types/request';
import { encryptData, decryptData } from '../utils/encryption';

jest.mock('../../src/repositories/userRepository');
jest.mock('../../src/utils/encryption');

describe('signUpUserService', () => {
  const validSignUpData: SignUpPayload = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    createdDate: '2025-02-18',
    userType: 'student',
  };

  it('should successfully encrypt the password and create the user', async () => {
    const encryptedPassword = 'encryptedPassword';

    (encryptData as jest.Mock).mockReturnValue(encryptedPassword);

    (createUser as jest.Mock).mockResolvedValue(undefined);

    await signUpUserService(validSignUpData);

    expect(encryptData).toHaveBeenCalledWith(validSignUpData.password);
    expect(createUser).toHaveBeenCalledWith({
      ...validSignUpData,
      password: encryptedPassword,
    });
  });

  it('should throw an ApiError when there is an error during password encryption', async () => {
    const errorMessage = 'Error encrypting password';

    (encryptData as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(signUpUserService(validSignUpData)).rejects.toThrow(
      new ApiError(500, errorMessage),
    );
  });

  it('should throw an ApiError when userRepository.createUser fails', async () => {
    const encryptedPassword = 'encryptedPassword';

    (encryptData as jest.Mock).mockReturnValue(encryptedPassword);

    const createUserErrorMessage = 'Error creating user';

    (createUser as jest.Mock).mockRejectedValue(new Error(createUserErrorMessage));

    await expect(signUpUserService(validSignUpData)).rejects.toThrow(
      new ApiError(500, createUserErrorMessage),
    );
  });
});

describe('userDetailsService', () => {
  it('should return user details when a valid userId is provided', async () => {
    const mockUser = {
      userId: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'encryptedPassword',
      createdDate: '2025-02-18',
      userType: 'student',
    };

    (decryptData as jest.Mock).mockReturnValue('Password123');

    (getUserById as jest.Mock).mockResolvedValue(mockUser);

    const user = await userDetailsService(1);

    expect(user).toEqual({
      full_name: mockUser.fullName,
      password: 'Password123',
      email: mockUser.email,
      created_date: mockUser.createdDate,
      user_type: mockUser.userType,
    });
    expect(getUserById).toHaveBeenCalledWith(1);
    expect(decryptData).toHaveBeenCalledWith(mockUser.password);
  });

  it('should throw an ApiError when userRepository.getUserById fails', async () => {
    const errorMessage = 'Database error';

    (getUserById as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(userDetailsService(1)).rejects.toThrow(new ApiError(500, errorMessage));
  });
});
