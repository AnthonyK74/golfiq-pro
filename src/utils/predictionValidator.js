export function validatePrediction(predictions = [], results = []) {
  const actualPositions = new Map();

  for (const result of results) {
    actualPositions.set(
      String(result.player.id),
      Number(result.position)
    );
  }

  const comparison = predictions
    .map((player, index) => {
      const actual =
        actualPositions.get(
          String(player.player.id)
        );

      if (actual == null) return null;

      return {
        player: player.player.display_name,
        predicted: index + 1,
        actual,
        error: Math.abs(actual - (index + 1)),
      };
    })
    .filter(Boolean);

  if (!comparison.length) {
    return null;
  }

  const winner =
    comparison.find(
      (player) => player.actual === 1
    );

  const top10Hits = comparison.filter(
    (player) =>
      player.predicted <= 10 &&
      player.actual <= 10
  ).length;

  const top20Hits = comparison.filter(
    (player) =>
      player.predicted <= 20 &&
      player.actual <= 20
  ).length;

  const averageError =
    comparison.reduce(
      (sum, player) => sum + player.error,
      0
    ) / comparison.length;

  return {
    winnerPredicted:
      winner?.predicted === 1,

    winnerTop5:
      winner?.predicted <= 5,

    winnerTop10:
      winner?.predicted <= 10,

    top10Hits,

    top20Hits,

    averageError:
      Number(averageError.toFixed(2)),

    comparison,
  };
}