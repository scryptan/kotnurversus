export default {
  categories: ["categories"] as const,
  challenges: (roundId?: string) =>
    roundId ? (["challenges", roundId] as const) : (["challenges"] as const),
  tourney: (tourneyId?: string) => ["tourney", tourneyId] as const,
  tourneys: ["tourneys"] as const,
  round: (roundId: string) => ["round", roundId] as const,
  rounds: (tourneyId: string) => ["rounds", tourneyId] as const,
  users: ["users"] as const,
};
