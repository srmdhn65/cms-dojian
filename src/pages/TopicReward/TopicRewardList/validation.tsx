import { ZodType, z } from 'zod';

export type CategoryForm = {
  sender: string;
};

const post: ZodType<CategoryForm> = z.object({
  sender: z.string().min(1, { message: 'Pengirim tidak boleh kosong' }),
});

export default { post };
