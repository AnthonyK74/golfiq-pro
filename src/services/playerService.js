import { getLastFiveTournamentStats } from "./golfApi";
import { calculateGolfIQ } from "../utils/golfIQCalculator";

export async function getPlayerIntelligence(playerId) {
  const tournaments = await getLastFiveTournamentStats();



  const rounds = tournaments.filter(
  (player) => String(player.player.id) === String(playerId)
);

  if (rounds.length === 0) {
    return null;
  }

  const golfIQRatings = rounds.map((round) =>
    calculateGolfIQ(round)
  );

  const averageGolfIQ =
    golfIQRatings.reduce((a, b) => a + b, 0) / golfIQRatings.length;

  const latest = rounds[rounds.length - 1];

  return {
    player: latest.player,

    averageGolfIQ,

    tournaments: rounds.length,

    strokesGained: {
      ott: Number(latest.sg_off_tee ?? 0),
      app: Number(latest.sg_approach ?? 0),
      arg: Number(latest.sg_around_green ?? 0),
      putt: Number(latest.sg_putting ?? 0),
      total: Number(latest.sg_total ?? 0),
    },

    drivingAccuracy: Number(latest.driving_accuracy ?? 0),

    greensInRegulation: Number(
      latest.greens_in_regulation ?? 0
    ),

    scrambling: Number(latest.scrambling ?? 0),

    ratings: golfIQRatings,
  };
}