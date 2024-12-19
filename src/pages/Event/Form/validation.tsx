import { ZodType, z } from 'zod';

export type EventForm = {
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  rewardBadge: string;
  rewardCoins: number;
  rewardXp: number;
}
const post: ZodType<EventForm> = z.object({
  name: z.coerce.string().min(1, { message: 'Name tidak boleh kosong' }),
  description: z.coerce.string().nullable(),
  startDate: z.coerce.string().min(1, { message: 'Start Date' }),
  endDate: z.coerce.string().min(1, { message: 'End Date' }),
  rewardBadge: z.coerce.string().min(1, { message: 'Reward Badges' }),
  rewardCoins: z.coerce.number().min(1, { message: 'Reward Coints' }),
  rewardXp: z.coerce.number().min(1, { message: 'Reward Xp' }),
});

export default { post };

