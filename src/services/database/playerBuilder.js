import { calculatePlayerAnalytics } from "../../utils/playerAnalytics";
import { calculateGolfIQRating } from "../golfiqRating";
import { calculateCourseFit } from "../../utils/courseFit";

export function groupRoundsByPlayer(rounds) {
  const grouped = new Map();

  for (const round of rounds) {
    const id = String(round.player.id);

    if (!grouped.has(id)) {
      grouped.set(id, []);
    }

    grouped.get(id).push(round);
  }

  return grouped;
}

export function getLastFiveStarts(playerRounds) {
  const tournaments = new Map();

  for (const round of playerRounds) {
    const id = round.tournament?.id;

    if (!id) continue;

    if (!tournaments.has(id)) {
      tournaments.set(id, {
        date: round.tournament?.start_date,
        rounds: [],
      });
    }

    tournaments.get(id).rounds.push(round);
  }

  return [...tournaments.values()]
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 5)
    .flatMap((t) => t.rounds);
}

export function getTourModeRounds(
  playerRounds,
  latestTournamentIds
) {
  return playerRounds.filter((round) =>
    latestTournamentIds.includes(
      round.tournament?.id
    )
  );
}

export function buildPlayer(
  selectedRounds,
  playerResults
) {
  const analytics =
    calculatePlayerAnalytics(selectedRounds);

  if (!analytics) return null;

  const tournamentCount = new Set(
    selectedRounds.map(
      (r) => r.tournament?.id
    )
  ).size;

  analytics.events = tournamentCount;
  analytics.rounds = selectedRounds.length;

  const golfIQ =
    calculateGolfIQRating(analytics);

  const courseFit =
    calculateCourseFit(analytics);

  const metrics = golfIQ.metrics;

  const metricList = [
    ["Off the Tee", metrics.offTee],
    ["Approach", metrics.approach],
    ["Around the Green", metrics.aroundGreen],
    ["Putting", metrics.putting],
    ["Ball Striking", metrics.ballStriking],
    ["Short Game", metrics.shortGame],
  ];

  const sorted = [...metricList].sort(
    (a, b) => b[1] - a[1]
  );

  return {
    ...analytics,

    rounds: selectedRounds,

    starts: tournamentCount,

    results: playerResults,

    courseFit,

    golfIQ: {
      ...golfIQ,

      strengths: sorted
        .slice(0, 3)
        .map(([name]) => name),

      weaknesses: sorted
        .slice(-2)
        .map(([name]) => name),

      archetype:
        metrics.offTee >= 85
          ? "🚀 Power Driver"
          : metrics.approach >= 85
          ? "🎯 Iron Specialist"
          : metrics.shortGame >= 85
          ? "🧙 Short Game Wizard"
          : metrics.putting >= 85
          ? "🎱 Putting Specialist"
          : "Balanced Player",
    },
  };
}