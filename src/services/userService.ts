import { createUser, getUserById } from '../repositories/userRepository';
import { SignUpPayload } from '../types/payloads';
import ApiError from '../errors/apiError';
import logger from '../logger/pino';
import { encryptData, decryptData } from '../utils/encryption';

const signUpUserService = async ({
  fullName, email, password, createdDate, userType,
}: SignUpPayload): Promise<void> => {
  try {
    logger.info('Sign up service request received');

    const userData = {
      fullName,
      email,
      password: encryptData(password),
      createdDate,
      userType,
    };

    await createUser(userData);
  } catch (error: any) {
    logger.error({ error });

    throw new ApiError(500, error.message);
  }
};

const userDetailsService = async (userId: number) => {
  try {
    logger.info('User details service request received');

    const user = await getUserById(userId);

    if (!user) throw new ApiError(404, 'User not found');

    return {
      full_name: user.fullName,
      password: decryptData(user.password),
      email: user.email,
      created_date: user.createdDate,
      user_type: user.userType,
    };
  } catch (error: any) {
    logger.error({ error });

    throw new ApiError(500, error.message);
  }
};

export { signUpUserService, userDetailsService };
