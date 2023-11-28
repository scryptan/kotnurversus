export type Challenge = {
  id: string;
  categoryId: string;
  title: string;
  description?: string;
  isCatInBag: boolean;
};

export type CreateChallenge = Omit<Challenge, "id">;
