export type BadgeInterface = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}