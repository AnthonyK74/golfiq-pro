import {
  getCompletedTournaments,
  getTournamentResults,
} from "../golfApi";

let resultsCache = null;

export async function loadResults() {
  if (resultsCache) {
    return resultsCache;
  }

  const tournamentsResponse =
    await getCompletedTournaments();

  const tournaments =
    tournamentsResponse.data ?? [];

  const requests = tournaments.map(async (tournament) => {
    const results = [];
    let page = 1;

    while (true) {
      try {
        const response =
          await getTournamentResults(
            tournament.id,
            page
          );

        const data =
          response.data ?? [];

        if (!data.length) break;

        results.push(...data);

        const nextPage =
          response.meta?.next_page;

        if (!nextPage) break;

        page = nextPage;
      } catch {
        break;
      }
    }

    return results;
  });

  const pages = await Promise.all(requests);

  resultsCache = pages.flat();

  return resultsCache;
}