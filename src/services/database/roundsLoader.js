import {
  getCompletedTournaments,
  getTournamentStats,
} from "../golfApi";

import {
  hasCache,
  getCache,
  setCache,
} from "../cacheService";

export async function loadRounds() {
  if (hasCache()) {
    return getCache();
  }

  const tournamentsResponse =
    await getCompletedTournaments();

  const tournaments =
    tournamentsResponse.data ?? [];

  const requests = tournaments.map(async (tournament) => {
    const rounds = [];
    let page = 1;

    while (true) {
      try {
        const response =
          await getTournamentStats(
            tournament.id,
            page
          );

        const data =
          response.data ?? [];

        if (!data.length) break;

        rounds.push(...data);

        const nextPage =
          response.meta?.next_page;

        if (!nextPage) break;

        page = nextPage;
      } catch {
        break;
      }
    }

    return rounds;
  });

  const results = await Promise.all(requests);

  const allRounds = results.flat();

  setCache(allRounds);

  return allRounds;
}