import { getLeaderboard } from "./statsService";
import { getUpcomingTournaments } from "./golfApi";
import { calculateCourseFit } from "../utils/courseFit";

export async function getDashboardData() {
  const leaderboard = await getLeaderboard("cgi", "starts");

  const worldNo1 = leaderboard[0] ?? null;

  const hottestPlayer =
    leaderboard.find((player) => player.trend === "🔥 Hot") ??
    leaderboard[0] ??
    null;

  const favourite = leaderboard[0] ?? null;

  let bestCourseFit = null;

  if (leaderboard.length) {
    bestCourseFit = leaderboard
      .map((player) => ({
        ...player,
        courseFit: calculateCourseFit(player),
      }))
      .sort(
        (a, b) =>
          b.courseFit.score - a.courseFit.score
      )[0];
  }

  let nextTournament = null;

  try {
    const response = await getUpcomingTournaments();

    nextTournament = response.data?.[0] ?? null;
  } catch (error) {
    console.warn("Unable to load upcoming tournament", error);
  }

  return {
    worldNo1,
    hottestPlayer,
    favourite,
    bestCourseFit,
    nextTournament,
    leaderboard: leaderboard.slice(0, 10),
  };
}