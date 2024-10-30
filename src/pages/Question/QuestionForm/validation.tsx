import { ZodType, z } from 'zod';

export type QuestionForm = {
  topic_id: string,
  question_text: string ,
  question_type: string ,
  // options: string[] | null,
  // correct_answer: string,
  // case_study_details: string | null,
 }
const post: ZodType<QuestionForm> = z.object({
  topic_id: z.coerce.string().min(1, { message: 'Topic tidak boleh kosong' }),
  question_text: z.coerce.string().min(1, { message: 'Pertanyaan tidak boleh kosong' }),
  question_type: z.coerce.string().min(1, { message: 'Jenis pertanyaan tidak boleh kosong' }),
  // options: z.array(z.string()).nullable(),
  // correct_answer: z.string().min(1, { message: 'Jawaban yang benar tidak boleh kosong' }),
  // case_study_details: z.string().nullable(),
  });
  
export default { post };

