import { ZodType, z } from 'zod';

export type TopicForm = {
    name: string;
    description: string;
    point_cost: string;
    level: string;
    imagesUrl: string[] | null;
    // status: boolean;
    // slug: string;
    // id: string;
    // createdAt: string;
    // updatedAt: string;
    // deletedAt: string;
 }
const post: ZodType<TopicForm> = z.object({
    name: z.string().min(1, 'Nama tidak boleh kosong'),
    description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
    point_cost: z.string().min(1, 'Harga tidak boleh kosong'),
    level: z.string().min(1, 'Level tidak boleh kosong'),
    imagesUrl: z.array(z.string()).nullable(),
    // video: z.string().nullable(),
    // status: z.boolean().nullable(),
    // slug: z.string().nullable(),
    // id: z.string().nullable(),
    // createdAt: z.string().nullable(),
    // updatedAt: z.string().nullable(),
    // deletedAt: z.string().nullable(),
  });
  
export default { post };

