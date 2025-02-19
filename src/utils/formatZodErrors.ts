import { ZodError } from 'zod';

const formatZodErrors = (error: ZodError) => {
  const formattedErrors = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return formattedErrors;
};

export default formatZodErrors;
