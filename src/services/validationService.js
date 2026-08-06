import {
  getTournament,
  getTournamentResults,
} from "./golfApi";

import {
  getHistoricalPlayers,
} from "./historicalStatsService";

async function generatePredictions(
  tournament,
  fieldPlayerIds
) {
 const players =
  await getHistoricalPlayers(
    tournament,
    fieldPlayerIds
  );

  return [...players].sort(
    (a, b) =>
      (b.golfIQ?.rating ?? 0) -
      (a.golfIQ?.rating ?? 0)
  );
}

function compareRankings(
  predictions,
  actualResults
) {
  const actualMap = new Map();

  actualResults.forEach((result, index) => {
    const playerId =
      result.player?.id ??
      result.player_id;

    actualMap.set(playerId, {
      rank: index + 1,
      result,
    });
  });

  let winnerCorrect = false;

  let top5Correct = 0;
  let top10Correct = 0;
  let top20Correct = 0;

  let comparedPlayers = 0;
  let totalRankingError = 0;

  const comparisons = [];

  predictions.forEach(
    (prediction, index) => {
      const predictedRank = index + 1;

      const playerId =
        prediction.player?.id ??
        prediction.player_id;

      const actual =
        actualMap.get(playerId);

      if (!actual) return;

      const actualRank =
        actual.rank;

      comparedPlayers++;

      const rankingError = Math.abs(
        predictedRank - actualRank
      );

      totalRankingError +=
        rankingError;

      if (
        predictedRank === 1 &&
        actualRank === 1
      ) {
        winnerCorrect = true;
      }

      if (
        predictedRank <= 5 &&
        actualRank <= 5
      ) {
        top5Correct++;
      }

      if (
        predictedRank <= 10 &&
        actualRank <= 10
      ) {
        top10Correct++;
      }

      if (
        predictedRank <= 20 &&
        actualRank <= 20
      ) {
        top20Correct++;
      }

      comparisons.push({
  predictionId:
    prediction.player?.id ??
    prediction.player_id,

  actualId:
    actual.result.player?.id ??
    actual.result.player_id,

  player:
    prediction.player?.first_name +
    " " +
    prediction.player?.last_name,

  actualPlayer:
    actual.result.player
      ? `${actual.result.player.first_name} ${actual.result.player.last_name}`
      : actual.result.player_name,

  predictedRank,

  actualRank,

  rankingError,

  golfIQ:
    prediction.golfIQ?.rating ?? 0,
});
    }
  );
console.table(comparisons.slice(0, 20));
  return {
    winnerCorrect,

    top5Correct,
    top10Correct,
    top20Correct,

    top5Percentage:
      (top5Correct / 5) * 100,

    top10Percentage:
      (top10Correct / 10) * 100,

    top20Percentage:
      (top20Correct / 20) * 100,

    playersCompared:
      comparedPlayers,

    meanRankingError:
      comparedPlayers
        ? totalRankingError /
          comparedPlayers
        : 0,

    comparisons,
  };
}

export async function validateTournament(
  tournamentId
) {
  const tournamentResponse =
    await getTournament(
      tournamentId
    );

  const tournament =
    tournamentResponse.data?.[0] ??
    tournamentResponse.data ??
    tournamentResponse;

    console.log("====================================");
console.log("SELECTED TOURNAMENT");
console.log({
  id: tournament.id,
  season: tournament.season,
  name: tournament.name,
  start: tournament.start_date,
  end: tournament.end_date,
});
console.log("====================================");

  const resultsResponse =
    await getTournamentResults(
      tournamentId
    );

  const actualResults =
    resultsResponse.data ?? [];

    console.log(actualResults[0].player);

    console.log(
  "Tournament results returned:",
  actualResults.length
);

console.log(
  "Tournament meta:",
  resultsResponse.meta
);

  const fieldPlayerIds = new Set(
  actualResults.map(
    (result) => result.player.id
  )
);

console.log(
  "Players in field:",
  fieldPlayerIds.size
);

const allPlayers =
  await generatePredictions(
    tournament,
    fieldPlayerIds
  );

const predictions =
  allPlayers.filter(
    (player) => !player.excluded
  );

const playersInField =
  fieldPlayerIds.size;

const playersAnalysed =
  predictions.length;

const playersExcluded =
  playersInField - playersAnalysed;

console.log("====================================");
console.log("VALIDATION SUMMARY");
console.log("Players in field:", playersInField);
console.log("Players analysed:", playersAnalysed);
console.log("Players excluded:", playersExcluded);
console.log("====================================");

  const metrics =
    compareRankings(
      predictions,
      actualResults
    );

  return {
    tournamentId,
    tournamentName:
      tournament.name,
    season:
      tournament.season,
    startDate:
      tournament.start_date,

    playersInField,

playersAnalysed,

playersExcluded,

    playersCompared:
      metrics.playersCompared,

    predictedWinner:
      predictions[0]?.player
        ? `${predictions[0].player.first_name} ${predictions[0].player.last_name}`
        : null,

    actualWinner:
      actualResults[0]?.player
        ? `${actualResults[0].player.first_name} ${actualResults[0].player.last_name}`
        : null,

    winnerCorrect:
      metrics.winnerCorrect,

    top5Correct:
      metrics.top5Correct,
    top5Percentage:
      Number(
        metrics.top5Percentage.toFixed(
          1
        )
      ),

    top10Correct:
      metrics.top10Correct,
    top10Percentage:
      Number(
        metrics.top10Percentage.toFixed(
          1
        )
      ),

    top20Correct:
      metrics.top20Correct,
    top20Percentage:
      Number(
        metrics.top20Percentage.toFixed(
          1
        )
      ),

    meanRankingError:
      Number(
        metrics.meanRankingError.toFixed(
          2
        )
      ),

    comparisons:
      metrics.comparisons,
  };
}