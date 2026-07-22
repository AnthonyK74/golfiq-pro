import {
  getCompletedTournaments,
  getTournamentStats,
} from "./golfApi";

import {
  hasCache,
  getCache,
  setCache,
  clearCache,
} from "./cacheService";

import { getTopPlayers } from "./leaderboardService";

async function loadPlayerStats() {
  if (hasCache()) {
    console.log("Using cached statistics...");
    return getCache();
  }

  console.log("Loading statistics from API...");

  const tournamentsResponse = await getCompletedTournaments();
  const tournaments = tournamentsResponse.data ?? [];

  const allPlayers = [];

  for (const tournament of tournaments) {
    console.log(`Loading tournament ${tournament.id}`);

    try {
      const response = await getTournamentStats(tournament.id, 1);

      const players = response.data ?? [];

      allPlayers.push(...players);
    } catch (err) {
      console.error(
        `Failed loading tournament ${tournament.id}`,
        err
      );
    }
  }

  console.log(`Loaded ${allPlayers.length} player records`);

  setCache(allPlayers);

  return allPlayers;
}

export async function getLeaderboard(statField) {
  const players = await loadPlayerStats();

  return getTopPlayers(players, statField);
}

export function refreshStatistics() {
  clearCache();
}