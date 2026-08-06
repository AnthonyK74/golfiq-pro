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
  getOfficialTournaments().sort(
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

const historicalTournaments =
  tournaments.filter((tournament) => {
    const end = new Date(tournament.end_date);

    return (
  tournament.season === selectedTournament.season &&
  end >= lookback &&
  end < cutoff
);
  });


  console.log(
    "Current Form Window:"
  );

  console.log(
    lookback.toISOString().split("T")[0],
    "→",
    cutoff.toISOString().split("T")[0]
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
  const ids = [
    ...new Set(
      rounds.map((round) => round.tournament.id)
    ),
  ];


  return ids.length;
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


  // Only analyse players that actually
  // played in the tournament being validated.
  if (fieldPlayerIds) {
    grouped = grouped.filter(
      ({ player }) =>
        fieldPlayerIds.has(player.id)
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

  analysedPlayers.sort(
    (a, b) =>
      (b.golfIQ?.rating ?? 0) -
      (a.golfIQ?.rating ?? 0)
  );
return analysedPlayers;
}