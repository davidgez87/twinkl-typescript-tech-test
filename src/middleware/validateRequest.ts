import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import signUpSchema from '../schemas/userSignup';
import userDetailsSchema from '../schemas/userDetails';
import ApiError from '../errors/apiError';
import formatZodErrors from '../utils/formatZodErrors';
import logger from '../logger/pino';

const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  try {
    logger.info('Validating request');

    if (req.method === 'POST') {
      signUpSchema.parse(req.body);
    }

    if (req.method === 'GET') {
      userDetailsSchema.parse(req.params);
    }

    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error({ error });
      return next(new ApiError(400, 'Validation failed', formatZodErrors(error)));
    }

    if (error instanceof Error) {
      logger.error({ error });
      return next(new ApiError(500, error.message));
    }

    return next(new ApiError(500, 'Internal Server Error'));
  }
};

export default validateRequest;
