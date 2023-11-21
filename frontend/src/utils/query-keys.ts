export default {
  tourney: (id: string) => ["tourney", id] as const,
  tourneys: ["tourneys"] as const,
};
