import { getTournamentStats } from "./golfApi";
import { getOfficialTournaments } from "./tournamentRegistry";

/**
 * Loads historical tournament rounds for every previous
 * edition of a tournament.
 *
 * Results are cached so they are only downloaded once.
 */

const cache = new Map();

export async function loadTournamentHistory(tournament) {
  if (cache.has(`tournament:${tournament.name}`)) {
    return cache.get(tournament.name);
  }

  const history = [];

  const previousTournaments =
    getOfficialTournaments().filter(
      (t) =>
        t.name === tournament.name &&
        t.season < tournament.season
    );

  for (const event of previousTournaments) {
    try {
      const response =
        await getTournamentStats(event.id);

      history.push(...(response.data ?? []));
    } catch (err) {
      console.error(err);
    }
  }

  cache.set(
  `tournament:${tournament.name}`,
  history
);

  return history;
}