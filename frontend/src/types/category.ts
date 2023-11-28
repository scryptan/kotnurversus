export type Category = {
  id: string;
  title: string;
  color: string;
};

export type CreateCategory = Omit<Category, "id">;
