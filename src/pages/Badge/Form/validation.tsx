import { ZodType, z } from 'zod';

export type BadgeForm = {
  name: string;
  description: string | null;
 }
const post: ZodType<BadgeForm> = z.object({
  name: z.coerce.string().min(1, { message: 'Name tidak boleh kosong' }),
  description: z.coerce.string().nullable(),
  });
  
export default { post };

