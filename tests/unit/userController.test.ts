import request from 'supertest';
import { app, initializeApp } from '../../src/app';
import { signUpUserService, userDetailsService } from '../../src/services/userService';
import { SignUpPayload } from '../../src/types/payloads';
import { prisma } from '../../src/config/database';

jest.mock('../../src/services/userService');

beforeAll(async () => {
  await initializeApp();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /signUp', () => {
  const validSignUpData: SignUpPayload = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
    createdDate: '2025-02-18',
    userType: 'student',
  };

  it('should return 201 and sign up the user successfully', async () => {
    (signUpUserService as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post('/signUp')
      .send(validSignUpData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User signed up successfully');
    expect(signUpUserService).toHaveBeenCalledWith(validSignUpData);
  });

  it('should return 500 if there is an error in the service layer', async () => {
    (signUpUserService as jest.Mock).mockRejectedValue(new Error('Service error'));

    const response = await request(app)
      .post('/signUp')
      .send(validSignUpData);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});

describe('GET /user/:id', () => {
  it('should return 200 and user details for a valid user ID', async () => {
    const mockUser = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
    };

    (userDetailsService as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).get('/user/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(userDetailsService).toHaveBeenCalledWith(1);
  });

  it('should return 500 if there is an error in the service layer', async () => {
    (userDetailsService as jest.Mock).mockRejectedValue(new Error('Service error'));

    const response = await request(app).get('/user/1');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
