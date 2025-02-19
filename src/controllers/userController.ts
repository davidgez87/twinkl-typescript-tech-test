import { Request, Response, NextFunction } from 'express';
import { signUpUserService, userDetailsService } from '../services/userService';
import { SignUpPayload } from '../types/payloads';

export const signUpUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      fullName, email, password, createdDate, userType,
    }: SignUpPayload = req.body;

    await signUpUserService({
      fullName, email, password, createdDate, userType,
    });

    return res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    return next(error);
  }
};

export const userDetailsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);

    const user = await userDetailsService(id);

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

export default { signUpUserController, userDetailsController };
