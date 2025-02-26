import { Request, Response, NextFunction } from 'express';
import { signUpUserController, userDetailsController } from './userController';
import { signUpUserService, userDetailsService } from '../services/userService';
import { SignUpPayload } from '../types/request';
import ApiError from '../errors/apiError';

// Mock the service functions
jest.mock('../services/userService', () => ({
  signUpUserService: jest.fn(),
  userDetailsService: jest.fn(),
}));

describe('POST /signUp', () => {
  const validSignUpData: SignUpPayload = {
    fullName: 'David Geraghty',
    email: 'dg@email.com',
    password: 'Password123',
    createdDate: '16-01-2025',
    userType: 'student',
  };

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: validSignUpData,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should return 201 and sign up the user successfully', async () => {
    (signUpUserService as jest.Mock).mockResolvedValue(undefined);

    await signUpUserController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User signed up successfully' });
    expect(signUpUserService).toHaveBeenCalledWith(validSignUpData);
  });

  it('should call next with error if signUpUserService throws a 500 error', async () => {
    const error = new ApiError(500, 'Internal server error');

    (signUpUserService as jest.Mock).mockRejectedValue(error);

    await signUpUserController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('GET /user/:id', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: { id: '1' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should return 200 and user details for a valid user ID', async () => {
    const mockUser = { id: 1, fullName: 'John Doe', email: 'john@example.com' };

    // Mocking the user details service
    (userDetailsService as jest.Mock).mockResolvedValue(mockUser);

    await userDetailsController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    expect(userDetailsService).toHaveBeenCalledWith(1);
  });

  it('should call next with error if userDetailsService throws a 404 error', async () => {
    const error = new ApiError(404, 'User not found');

    (userDetailsService as jest.Mock).mockRejectedValue(error);

    await userDetailsController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should call next with error if userDetailsService throws a 500 error', async () => {
    const error = new ApiError(500, 'Internal server error');

    (userDetailsService as jest.Mock).mockRejectedValue(error);

    await userDetailsController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
