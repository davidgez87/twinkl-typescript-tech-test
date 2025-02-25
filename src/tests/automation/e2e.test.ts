import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app, initializeApp } from '../../app';
import buildUserData from '../helpers/methods';
import validationTestCases from '../helpers/constants';

const prisma = new PrismaClient();

describe('E2E Tests', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await initializeApp();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const data = buildUserData();

  describe('/signUp', () => {
    it('should return a 201 with valid payload', async () => {
      const response = await request(app).post('/signUp').send(data);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User signed up successfully');

      const user = await prisma.user.findFirst({ where: { email: data.email } });
      expect(user).not.toBeNull();
    });

    it('should return 400 if email is already taken', async () => {
      const response = await request(app).post('/signUp').send(data);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email is already taken');
    });

    it.each(validationTestCases)('$description', async ({ field, value, expectedField }) => {
      const response = await request(app).post('/signUp').send(buildUserData({ [field]: value }));

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation failed');

      const { errors } = response.body;

      expect(errors).toBeDefined();
      expect(Array.isArray(errors)).toBe(true);

      const [{ field: errorField }] = errors;

      expect(errorField).toBe(expectedField);
    });
  });

  describe('/user/:userId', () => {
    it('should return 200 if valid user id', async () => {
      const createdUser = await prisma.user.findUnique({
        where: { email: data.email },
        select: { userId: true },
      });

      expect(createdUser).not.toBeNull();
      const { userId } = (createdUser!);

      const response = await request(app).get(`/user/${userId}`);

      expect(response.status).toBe(200);
    });

    it('should return 400 if invalid request parameter type', async () => {
      const response = await request(app).get('/user/notANumber');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation failed');

      const { errors } = response.body;

      expect(errors).toBeDefined();
      expect(Array.isArray(errors)).toBe(true);

      const [{ field: errorField }] = errors;

      expect(errorField).toBe('id');
    });

    it('should return 404 for a non-existing user', async () => {
      const response = await request(app).get('/user/99999999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});
