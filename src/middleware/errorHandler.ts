import { Request, Response, NextFunction } from 'express';
import ApiError from '../errors/apiError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction): Response => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

export default errorHandler;
