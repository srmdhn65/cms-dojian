// src/types/category.ts
export type TopicInterface = {
    id: number | null;
    name: string;
    description: string;
    slug: string | null;
    point_cost: string;
    status: boolean | null;
    level: string | null;
    images: string[] | null;
    video: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  }
  