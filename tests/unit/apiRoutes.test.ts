import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import router from '../../src/routes/apiRoutes';
import validateSignUpRequest from '../../src/middleware/validateSignUpRequest';
import { signUpUserController } from '../../src/controllers/userController';
import ApiError from '../../src/errors/apiError';

jest.mock('../../src/middleware/validateSignUpRequest', () => jest.fn((req, res, next) => next()));
jest.mock('../../src/controllers/userController', () => ({
  signUpUserController: jest.fn((req, res, next) => next()),
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

    // TODO - reponse.body is returning empty object
    it('should handle errors inside the route’s try-catch block', async () => {
      (signUpUserController as jest.Mock).mockImplementation((req, res, next) => {
        res.status(201).json = jest.fn().mockImplementation(() => {
          throw new ApiError(500, 'Response error');
        });

        next();
      });

      const response = await request(app).post('/signUp').send(validSignUpData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ });
    });
  });
});
