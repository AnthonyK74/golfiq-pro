import { calculatePlayerAnalytics } from "../utils/playerAnalytics";

export function getTopPlayers(players, statField = "cgi") {
  const groupedPlayers = new Map();

  // Group all tournament rounds by player
  for (const round of players) {
    const id = String(round.player.id);

    if (!groupedPlayers.has(id)) {
      groupedPlayers.set(id, []);
    }

    groupedPlayers.get(id).push(round);
  }

  // Calculate analytics for every player
  const leaderboard = [];

  for (const rounds of groupedPlayers.values()) {
    const analytics = calculatePlayerAnalytics(rounds);

    if (analytics) {
      leaderboard.push(analytics);
    }
  }

  // Sort by requested statistic
  leaderboard.sort((a, b) => {
    if (statField === "cgi") {
      return b.averages.cgi - a.averages.cgi;
    }

    return (
      (b.averages?.[statField] ?? 0) -
      (a.averages?.[statField] ?? 0)
    );
  });

  return leaderboard.slice(0, 20);
}