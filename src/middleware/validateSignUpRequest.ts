import { Request, Response, NextFunction } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ZodError } from 'zod';
import { SignUpPayload } from '../types/payloads';
import { signUpSchema } from '../schemas/userSignup';
import ApiError from '../errors/apiError';
import formatZodErrors from '../utils/formatZodErrors';

export const validateSignUpRequest = (
  req: Request<{}, {}, SignUpPayload>,
  res: Response,
  next: NextFunction,
) => {
  try {
    signUpSchema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = formatZodErrors(error);
      return next(new ApiError(400, 'Validation failed', formattedErrors));
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default validateSignUpRequest;
