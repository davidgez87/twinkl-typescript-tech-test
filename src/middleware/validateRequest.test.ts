import { Request, Response, NextFunction } from 'express';
import validateRequest from './validateRequest';
import signUpSchema from '../schemas/userSignup';
import userDetailsSchema from '../schemas/userDetails';
import ApiError from '../errors/apiError';
import * as formatZodErrors from '../utils/formatZodErrors';
import buildUserData from '../tests/helpers/methods';

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
    const validPostRequest = mockRequest('POST', buildUserData());

    validateRequest(validPostRequest, mockResponse() as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  describe('Validation Errors for an Invalid POST Request', () => {
    const validationScenarios = [
      { scenario: 'missing full name', input: { fullName: '' }, expectedError: { field: 'fullName', message: 'Full name is required' } },
      { scenario: 'invalid email format', input: { email: 'invalid-email' }, expectedError: { field: 'email', message: 'Invalid email address' } },
      { scenario: 'password too short', input: { password: 'short' }, expectedError: { field: 'password', message: 'Password must be at least 8 characters' } },
      { scenario: 'password too long', input: { password: 'a'.repeat(65) }, expectedError: { field: 'password', message: 'Password must be at most 64 characters' } },
      { scenario: 'password missing a digit', input: { password: 'NoDigitsHere' }, expectedError: { field: 'password', message: 'Password must contain at least one digit' } },
      { scenario: 'password missing a lowercase letter', input: { password: '12345678' }, expectedError: { field: 'password', message: 'Password must contain at least one lowercase letter' } },
      { scenario: 'password missing an uppercase letter', input: { password: 'lowercase1' }, expectedError: { field: 'password', message: 'Password must contain at least one uppercase letter' } },
      { scenario: 'invalid user type', input: { userType: 'unknown' }, expectedError: { field: 'userType', message: 'Invalid user type' } },
    ];

    it.each(validationScenarios)(
      'should return a validation error when $scenario',
      ({ input, expectedError }) => {
        const invalidPostRequest = mockRequest('POST', buildUserData(input));
        const mockFormattedErrors = [expectedError];

        jest.spyOn(formatZodErrors, 'default').mockReturnValue(mockFormattedErrors);

        validateRequest(invalidPostRequest, mockResponse() as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new ApiError(400, 'Validation failed', mockFormattedErrors));
      },
    );
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
    const unexpectedError = new ApiError(500, 'Unexpected error');

    jest.spyOn(signUpSchema, 'parse').mockImplementationOnce(() => {
      throw unexpectedError;
    });

    const req = mockRequest('POST', buildUserData());

    validateRequest(req, mockResponse() as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new ApiError(500, 'Unexpected error'));
  });

  it('should return 500 if an unexpected error occurs for GET', () => {
    const unexpectedError = new ApiError(500, 'Unexpected error');

    jest.spyOn(userDetailsSchema, 'parse').mockImplementationOnce(() => {
      throw unexpectedError;
    });

    const req = mockRequest('GET', { id: '123' });

    validateRequest(req, mockResponse() as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new ApiError(500, 'Unexpected error'));
  });
});
