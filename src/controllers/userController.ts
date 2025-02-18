import { Request, Response, NextFunction } from 'express';
import signUpUserService from '../services/userService'; // Import the userService
import { SignUpPayload } from '../types/payloads';

export const signUpUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      fullName, email, password, createdDate, userType,
    }: SignUpPayload = req.body;

    await signUpUserService({
      fullName, email, password, createdDate, userType,
    });

    return next();
  } catch (error) {
    return next(error);
  }
};

export default signUpUserController;
