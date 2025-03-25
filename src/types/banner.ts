// src/types/category.ts
export type BannerInterface = {
  id: number;
  title: string | null;
  slug: string | null;
  type: string | null;
  image: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
