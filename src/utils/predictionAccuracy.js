function round(value) {
  return Number(value.toFixed(2));
}

export function calculatePredictionAccuracy(
  predictions = [],
  actualResults = []
) {
  if (!predictions.length || !actualResults.length) {
    return null;
  }

  const actualMap = new Map();

  actualResults.forEach((player, index) => {
    actualMap.set(String(player.player.id), index + 1);
  });

  let totalError = 0;

  let top5Hits = 0;
  let top10Hits = 0;
  let top20Hits = 0;

  let comparedPlayers = 0;

  predictions.forEach((player, predictedIndex) => {
    const actualPosition = actualMap.get(
      String(player.player.id)
    );

    if (!actualPosition) return;

    comparedPlayers++;

    const predictedPosition = predictedIndex + 1;

    totalError += Math.abs(
      predictedPosition - actualPosition
    );

    if (
      predictedPosition <= 5 &&
      actualPosition <= 5
    ) {
      top5Hits++;
    }

    if (
      predictedPosition <= 10 &&
      actualPosition <= 10
    ) {
      top10Hits++;
    }

    if (
      predictedPosition <= 20 &&
      actualPosition <= 20
    ) {
      top20Hits++;
    }
  });

  const winnerCorrect =
    predictions[0]?.player.id ===
    actualResults[0]?.player.id;

  return {
    comparedPlayers,

    winnerCorrect,

    averagePositionError:
      comparedPlayers === 0
        ? 0
        : round(totalError / comparedPlayers),

    top5Accuracy: round(
      (top5Hits / 5) * 100
    ),

    top10Accuracy: round(
      (top10Hits / 10) * 100
    ),

    top20Accuracy: round(
      (top20Hits / 20) * 100
    ),
  };
}