import { z } from 'zod';

const userTypeEnum = z.enum(['student', 'teacher', 'parent', 'private tutor']);

const signUpSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(64, { message: 'Password must be at most 64 characters' })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' }),
  createdDate: z.string().min(1, { message: 'Created date is required' }),
  userType: userTypeEnum,
});

export default signUpSchema;
