import { ZodError, ZodIssue } from 'zod';
import { FormattedError } from '../types/request';

const formatZodErrors = (error: ZodError): FormattedError[] => {
  const formattedErrors: FormattedError[] = error.errors.map((err: ZodIssue) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return formattedErrors;
};

export default formatZodErrors;
