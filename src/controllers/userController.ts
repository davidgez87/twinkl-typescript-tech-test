import { Request, Response, NextFunction } from 'express';
import { signUpUserService, userDetailsService } from '../services/userService';
import { SignUpPayload } from '../types/payloads';
import logger from '../logger/pino';

export const signUpUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info({ user: req.body }, 'Sign up Controller request received');

    const {
      fullName, email, password, createdDate, userType,
    }: SignUpPayload = req.body;

    await signUpUserService({
      fullName, email, password, createdDate, userType,
    });

    return res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    logger.error({ error });

    return next(error);
  }
};

export const userDetailsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info({ user_id: req.params.id }, 'User details controller request received');

    const id = parseInt(req.params.id, 10);

    const user = await userDetailsService(id);

    return res.status(200).json(user);
  } catch (error) {
    logger.error({ error });

    return next(error);
  }
};

export default { signUpUserController, userDetailsController };
