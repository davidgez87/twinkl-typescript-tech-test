import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { SignUpPayload } from '../types/payloads';
import { signUpSchema } from '../schemas/userSignup';
import ApiError from '../errors/apiError';
import formatZodErrors from '../utils/formatZodErrors';
import logger from '../logger/pino';

const validateSignUpRequest = (
  req: Request<{}, {}, SignUpPayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info('Validating signup request');

    signUpSchema.parse(req.body);

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

export default validateSignUpRequest;
