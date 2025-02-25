import { Request, Response, NextFunction } from 'express';
import validateRequest from './validateRequest';
import signUpSchema from '../schemas/userSignup';
import userDetailsSchema from '../schemas/userDetails';
import ApiError from '../errors/apiError';
import * as formatZodErrors from '../utils/formatZodErrors';

const mockNext = jest.fn() as NextFunction;

const mockRequest = (method: 'POST' | 'GET', bodyOrParams: object): Request =>
  // eslint-disable-next-line implicit-arrow-linebreak
  ({ method, ...(method === 'POST' ? { body: bodyOrParams } : { params: bodyOrParams }) } as Request);

const mockResponse = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe('validateRequest Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() for a valid POST request', () => {
    const validPostRequest = mockRequest('POST', {
      fullName: 'John Doe',
      password: 'SecureP@ss123',
      email: 'johndoe@example.com',
      createdDate: '2024-02-18',
      userType: 'student',
    });

    validateRequest(validPostRequest, mockResponse() as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle validation errors for an invalid POST request', () => {
    const invalidPostRequest = mockRequest('POST', {
      fullName: 'John Doe',
      password: '123',
      email: 'invalid-email',
      createdDate: '2024-02-18',
      userType: 'invalidType',
    });

    const mockFormattedErrors = [
      { field: 'password', message: 'Password must be at least 8 characters long' },
      { field: 'email', message: 'Invalid email format' },
      { field: 'userType', message: 'Invalid user type' },
    ];

    jest.spyOn(formatZodErrors, 'default').mockReturnValue(mockFormattedErrors);

    validateRequest(invalidPostRequest, mockResponse() as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new ApiError(400, 'Validation failed', mockFormattedErrors));
  });

  it('should call next() for a valid GET request', () => {
    const validGetRequest = mockRequest('GET', { id: '123' });

    validateRequest(validGetRequest, mockResponse() as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle validation errors for an invalid GET request', () => {
    const invalidGetRequest = mockRequest('GET', { id: 'not-a-number' });

    const mockFormattedErrors = [{ field: 'id', message: 'ID must be a valid number as a string' }];

    jest.spyOn(formatZodErrors, 'default').mockReturnValue(mockFormattedErrors);

    validateRequest(invalidGetRequest, mockResponse() as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new ApiError(400, 'Validation failed', mockFormattedErrors));
  });

  it('should return 500 if an unexpected error occurs for POST', () => {
    const unexpectedError = new Error('Unexpected error');

    jest.spyOn(signUpSchema, 'parse').mockImplementationOnce(() => {
      throw unexpectedError;
    });

    const req = mockRequest('POST', { fullName: 'John Doe' });

    validateRequest(req, mockResponse() as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new ApiError(500, 'Unexpected error'));
  });

  it('should return 500 if an unexpected error occurs for GET', () => {
    const unexpectedError = new Error('Unexpected error');

    jest.spyOn(userDetailsSchema, 'parse').mockImplementationOnce(() => {
      throw unexpectedError;
    });

    const req = mockRequest('GET', { id: '123' });

    validateRequest(req, mockResponse() as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new ApiError(500, 'Unexpected error'));
  });
});
