import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import router from '../../src/routes/apiRoutes';
import validateSignUpRequest from '../../src/middleware/validateRequest';
import { signUpUserController, userDetailsController } from '../../src/controllers/userController';
import ApiError from '../../src/errors/apiError';

jest.mock('../../src/middleware/validateRequest', () => jest.fn((req, res, next) => next()));
jest.mock('../../src/controllers/userController', () => ({
  signUpUserController: jest.fn((req, res, next) => res.status(201).json({ message: 'User signed up successfully' })),
  userDetailsController: jest.fn((req, res, next) => res.status(200).json({ id: 1, fullName: 'John Doe', email: 'john@example.com' })),
}));

const app = express();
app.use(express.json());
app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: 'Internal server error' });
});

describe('API Routes', () => {
  it('GET /health should return 200 and status OK', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  describe('POST /signUp', () => {
    const validSignUpData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      createdDate: '2025-02-18',
      userType: 'student',
    };

    it('should call validation middleware and controller, then return 201', async () => {
      const response = await request(app).post('/signUp').send(validSignUpData);

      expect(validateSignUpRequest).toHaveBeenCalled();
      expect(signUpUserController).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User signed up successfully' });
    });

    it('should call next(error) if the controller throws an error', async () => {
      (signUpUserController as jest.Mock).mockImplementation((req, res, next) => {
        next(new ApiError(500, 'Controller error'));
      });

      const response = await request(app).post('/signUp').send(validSignUpData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /user/:id', () => {
    it('should call validation middleware and controller, then return 200', async () => {
      const response = await request(app).get('/user/1');

      expect(validateSignUpRequest).toHaveBeenCalled();
      expect(userDetailsController).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should return 500 if the controller throws an error', async () => {
      (userDetailsController as jest.Mock).mockImplementation((req, res, next) => {
        next(new ApiError(500, 'User not found'));
      });

      const response = await request(app).get('/user/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });
});
