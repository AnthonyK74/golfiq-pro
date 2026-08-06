import { getTournamentStats } from "./golfApi";
import { getOfficialTournaments } from "./tournamentRegistry";

import { calculatePlayerAnalytics } from "../utils/playerAnalytics";
import { calculateGolfIQRating } from "./golfiqRating";
import { calculateCourseFit } from "../utils/courseFit";

/**
 * Returns every historical round from the previous
 * 3 months before the selected event.
 */
 export async function getHistoricalRounds(
  selectedTournament,
  fieldPlayerIds = null
) {
  const tournaments =
  getOfficialTournaments(
    selectedTournament.season
  ).sort(
    (a, b) =>
      new Date(a.start_date) -
      new Date(b.start_date)
  );

  const cutoff =
  new Date(selectedTournament.start_date);

  const lookback =
    new Date(cutoff);

  lookback.setMonth(
    lookback.getMonth() - 3
  );

  console.log("====================================");
console.log("VALIDATION WINDOW");
console.log("Cutoff:", cutoff.toISOString().split("T")[0]);
console.log("Lookback:", lookback.toISOString().split("T")[0]);
console.log("====================================");

const historicalTournaments =
  tournaments.filter((tournament) => {
    const end = new Date(tournament.end_date);

    return (
      end >= lookback &&
      end < cutoff
    );
  });

console.table(
  historicalTournaments.map((t) => ({
    id: t.id,
    season: t.season,
    name: t.name,
    start: t.start_date,
    end: t.end_date,
  }))
);

  console.log(
    "Current Form Window:"
  );

  console.log(
    lookback.toISOString().split("T")[0],
    "→",
    cutoff.toISOString().split("T")[0]
  );

  console.log(
    "Tournaments found:",
    historicalTournaments.length
  );

  console.table(
    historicalTournaments.map((t) => ({
      id: t.id,
      name: t.name,
      start: t.start_date,
    }))
  );

  const allRounds = [];

  for (const tournament of historicalTournaments) {
    try {
      const response =
        await getTournamentStats(
          tournament.id
        );

      const rounds =
  response.data ?? [];

const filteredRounds =
  fieldPlayerIds
    ? rounds.filter((round) =>
        fieldPlayerIds.has(
          round.player.id
        )
      )
    : rounds;

console.log(
  `${tournament.name}: ${filteredRounds.length} rounds`
);

allRounds.push(
  ...filteredRounds
);

    } catch (err) {

      console.error(
        `Failed loading tournament ${tournament.id}`,
        err
      );

    }
  }

  console.log(
    "Historical rounds:",
    allRounds.length
  );

  return allRounds;
}

/**
 * Groups rounds by player.
 */
function groupRoundsByPlayer(rounds) {
  const players = new Map();

  for (const round of rounds) {
    const id = round.player.id;

    if (!players.has(id)) {
      players.set(id, {
        player: round.player,
        rounds: [],
      });
    }

    players.get(id).rounds.push(round);
  }

  return [...players.values()];
}

function countStarts(rounds) {
  return new Set(
    rounds.map(
      (round) => round.tournament.id
    )
  ).size;
}

/**
 * Returns analysed historical players.
 */
 export async function getHistoricalPlayers(
  selectedTournament,
  fieldPlayerIds = null
) {
  const rounds =
  await getHistoricalRounds(
    selectedTournament,
    fieldPlayerIds
  );

  let grouped =
    groupRoundsByPlayer(rounds);

  console.log(
    "Unique players found:",
    grouped.length
  );

  // Only analyse players that actually
  // played in the tournament being validated.
  if (fieldPlayerIds) {
    grouped = grouped.filter(
      ({ player }) =>
        fieldPlayerIds.has(player.id)
    );

    console.log(
      "Players in tournament field:",
      grouped.length
    );
  }

  const analysedPlayers = [];

  let skipped = 0;

  for (const player of grouped) {
    const analytics =
      calculatePlayerAnalytics(
        player.rounds
      );

    if (!analytics) {
      skipped++;
      continue;
    }

if (
  player.player.first_name === "Akshay" &&
  player.player.last_name === "Bhatia"
) {
  console.log("AKSHAY ANALYTICS");
  console.log(analytics);
}

    const golfIQ =
      calculateGolfIQRating({
        ...analytics,
      });

    const courseFit =
      calculateCourseFit({
        ...analytics,
      });

      const starts =
  countStarts(player.rounds);

if (starts < 5) {
  skipped++;
  continue;
}

analysedPlayers.push({
  player: player.player,

  startsLast3Months:
  starts,

  rounds: player.rounds,

  analytics,

  golfIQ,

  courseFit,

  trend:
    analytics.trend ?? null,

  confidence:
   starts >= 8
      ? "High"
      : starts >= 5
      ? "Medium"
      : "Low",
});
  }

  console.log(
    "Players skipped:",
    skipped
  );

  console.log(
    "Players analysed:",
    analysedPlayers.length
  );

  analysedPlayers.sort(
    (a, b) =>
      (b.golfIQ?.rating ?? 0) -
      (a.golfIQ?.rating ?? 0)
  );
return analysedPlayers;
}