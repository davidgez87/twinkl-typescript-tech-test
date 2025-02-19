import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository';
import { SignUpPayload } from '../types/payloads';
import ApiError from '../errors/apiError';

const signUpUserService = async ({
  fullName,
  email,
  password,
  createdDate,
  userType,
}: SignUpPayload): Promise<void> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await userRepository.createUser({
      fullName,
      email,
      password: hashedPassword,
      createdDate,
      userType,
    });
  } catch (error: any) {
    throw new ApiError(500, error.message);
  }
};

const userDetailsService = async (userId: number) => {
  try {
    return await userRepository.getUserById(userId);
  } catch (error: any) {
    throw new ApiError(500, error.message);
  }
};

export { signUpUserService, userDetailsService };
