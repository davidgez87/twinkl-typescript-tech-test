import { Request, Response, NextFunction } from 'express';
import ApiError from '../errors/apiError';
import errorHandler from './errorHandler';

const mockRequest = {} as Request;
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};
const mockNext = jest.fn() as NextFunction;

describe('Error Handler Middleware', () => {
  it('should handle an ApiError and return the correct response', () => {
    const error = new ApiError(400, 'Bad Request', [
      { field: 'email', message: 'Email is required' },
    ]);

    const res = mockResponse();

    errorHandler(error, mockRequest, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Bad Request',
      errors: [
        { field: 'email', message: 'Email is required' },
      ],
    });
  });

  it('should handle a non-ApiError and return a generic error message', () => {
    const error = new Error('Unknown error');
    const res = mockResponse();

    errorHandler(error as ApiError, mockRequest, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
    });
  });
});
