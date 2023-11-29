export default {
  categories: ["categories"] as const,
  challenges: ["challenges"] as const,
  tourney: (id: string) => ["tourney", id] as const,
  tourneys: ["tourneys"] as const,
  rounds: (tourneyId: string) => ["rounds", tourneyId] as const,
};
