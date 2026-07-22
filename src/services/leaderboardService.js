import { calculateCGI } from "./cgiService";

/**
 * Builds a leaderboard from raw player statistics.
 */
export function buildLeaderboard(players, statField) {
  const playerMap = {};

  players.forEach((player) => {
    const id = player.player.id;

    let value;

    if (statField === "cgi") {
      value = calculateCGI(player);
    } else {
      value = player[statField];
    }

    if (value == null) return;

    if (!playerMap[id]) {
      playerMap[id] = {
        id,
        name: player.player.display_name,
        country: player.player.country_code,
        total: 0,
        tournaments: 0,
      };
    }

    playerMap[id].total += value;
    playerMap[id].tournaments++;
  });

  return Object.values(playerMap)
    .map((player) => ({
      ...player,
      average: player.total / player.tournaments,
    }))
    .sort((a, b) => b.average - a.average);
}

/**
 * Returns the Top N players.
 */
export function getTopPlayers(players, statField, limit = 20) {
  return buildLeaderboard(players, statField).slice(0, limit);
}