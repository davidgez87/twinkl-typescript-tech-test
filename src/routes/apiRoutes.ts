import {
  Router, Request, Response, NextFunction,
} from 'express';
import validateSignUpRequest from '../middleware/validateSignUpRequest';
import { signUpUserController } from '../controllers/userController';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

router.post('/signUp', validateSignUpRequest, signUpUserController, (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
