export type Challenge = {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  isCatInBag: boolean;
};

export type CreateChallenge = Omit<Challenge, "id">;
