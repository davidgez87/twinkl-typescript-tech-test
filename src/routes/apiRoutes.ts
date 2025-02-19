import { Router } from 'express';
import validateSignUpRequest from '../middleware/validateSignUpRequest';
import { signUpUserController, userDetailsController } from '../controllers/userController';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

router.post('/signUp', validateSignUpRequest, signUpUserController);

router.get('/user/:id', userDetailsController);

export default router;
