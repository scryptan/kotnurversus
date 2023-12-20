export type Challenge = {
  id: string;
  categoryId: string;
  title: string;
  shortDescription?: string;
  description?: string;
  isCatInBag: boolean;
  order?: number;
};

export type CreateChallenge = Omit<Challenge, "id" | "order">;
