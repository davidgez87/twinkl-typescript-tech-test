import { Request, Response, NextFunction } from 'express';
import validateSignUpRequest from '../../src/middleware/validateSignUpRequest';
import { signUpSchema } from '../../src/schemas/userSignup';
import ApiError from '../../src/errors/apiError';
import * as formatZodErrors from '../../src/utils/formatZodErrors';

const mockRequest = (body: object) => ({
  body,
}) as Request;

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

const mockNext = jest.fn() as NextFunction;

describe('validateSignUpRequest Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() when the request body is valid', () => {
    const validRequestBody = {
      fullName: 'John Doe',
      password: 'SecureP@ss123',
      emailAddress: 'johndoe@example.com',
      createdDate: '2024-02-18',
      userType: 'student',
    };

    const req = mockRequest(validRequestBody);
    const res = mockResponse();

    validateSignUpRequest(req, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle validation errors and return a 400 response with formatted errors', () => {
    const invalidRequestBody = {
      fullName: 'John Doe',
      password: '123',
      emailAddress: 'invalid-email',
      createdDate: '2024-02-18',
      userType: 'invalidType',
    };

    const req = mockRequest(invalidRequestBody);
    const res = mockResponse();

    const mockFormattedErrors = [
      { field: 'password', message: 'Password must be between 8 and 64 characters' },
      { field: 'emailAddress', message: 'Invalid email address' },
      { field: 'userType', message: 'Invalid userType. Must be one of student, teacher, parent, private tutor' },
    ];

    jest.spyOn(formatZodErrors, 'default').mockReturnValue(mockFormattedErrors);

    validateSignUpRequest(req, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new ApiError(400, 'Validation failed', mockFormattedErrors),
    );
  });

  it('should return 500 if an unexpected error occurs', () => {
    const req = mockRequest({});
    const res = mockResponse();

    const unexpectedError = new Error('Unexpected error');

    jest.spyOn(signUpSchema, 'parse').mockImplementationOnce(() => { throw unexpectedError; });

    validateSignUpRequest(req, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });
});
