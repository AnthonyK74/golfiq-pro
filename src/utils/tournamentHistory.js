 /************************************************
 * Builds tournament history statistics from
 * cached historical rounds.
 ************************************************/
export function calculateTournamentHistory(
  playerId,
  historicalRounds = []
) {
  const playerRounds =
    historicalRounds.filter(
      (round) =>
        round.player?.id === playerId &&
        round.round_number === -1
    );

  if (!playerRounds.length) {
    return {
  starts: 0,
  wins: 0,
  top5s: 0,
  top10s: 0,
  top20s: 0,
  cutsMade: 0,
  missedCuts: 0,
  bestFinish: null,
  averageFinish: null,
  lastFinish: null,
  finishes: [],
  appearances: [],
};
  }
const appearances = playerRounds.map((round) => ({
  tournamentId: round.tournament?.id,
  tournamentName: round.tournament?.name,
  season: round.tournament?.season,
  startDate: round.tournament?.start_date,
  finish: round.rank,
}));

  const finishes = playerRounds
    .map((round) => round.rank)
    .filter((rank) => Number.isFinite(rank));

  const starts = playerRounds.length;

  const wins =
    finishes.filter((f) => f === 1).length;

const top5s =
  finishes.filter((f) => f <= 5).length;

  const top10s =
    finishes.filter((f) => f <= 10).length;

  const top20s =
    finishes.filter((f) => f <= 20).length;

const cutsMade = finishes.length;

const missedCuts =
  starts - cutsMade;

 const bestFinish =
  finishes.length
    ? Math.min(...finishes)
    : null;

const averageFinish =
  finishes.length
    ? finishes.reduce((a, b) => a + b, 0) /
      finishes.length
    : null; 

    const lastFinish =
  appearances.length > 0
    ? appearances
        .sort(
          (a, b) =>
            new Date(b.startDate) -
            new Date(a.startDate)
        )[0].finish
    : null;

  

return {
  starts,
  wins,
  top5s,
  top10s,
  top20s,
  cutsMade,
  missedCuts,
  bestFinish,
  averageFinish,
  lastFinish,
  finishes,
  appearances,
};
}