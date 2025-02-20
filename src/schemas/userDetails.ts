import { z } from 'zod';

const userDetailsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a numeric string'),
});

export default userDetailsSchema;
