import {
  getCompletedTournaments,
  getTournamentStats,
} from "./golfApi";

export async function getHistoricalRounds(cutoffDate) {
  const tournamentsResponse =
    await getCompletedTournaments();

  const tournaments =
    (tournamentsResponse.data ?? []).filter(
      (tournament) =>
        new Date(tournament.start_date) <
        new Date(cutoffDate)
    );

  const allRounds = [];

  for (const tournament of tournaments) {
    let page = 1;

    while (true) {
      try {
        const response =
          await getTournamentStats(
            tournament.id,
            page
          );

        const rounds =
          response.data ?? [];

        if (!rounds.length) break;

        allRounds.push(...rounds);

        const nextPage =
          response.meta?.next_page;

        if (!nextPage) break;

        page = nextPage;
      } catch {
        break;
      }
    }
  }

  return allRounds;
}