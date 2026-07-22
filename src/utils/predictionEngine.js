export function calculatePrediction(player) {
  const a = player.averages;

  const cgi = a.cgi ?? 0;
  const sgTotal = a.sg_total ?? 0;

  const history = player.history ?? [];

  let trend = 0;

  if (history.length >= 2) {
    const latest = history[0]?.sg_total ?? 0;
    const oldest = history[history.length - 1]?.sg_total ?? 0;

    trend = latest - oldest;
  }

  const consistency =
    history.length > 1
      ? 1 /
        (1 +
          standardDeviation(
            history.map((r) => r.sg_total ?? 0)
          ))
      : 1;

  const score =
    cgi * 45 +
    sgTotal * 30 +
    trend * 15 +
    consistency * 10;

  let form = "Neutral";
  let emoji = "➖";

  if (score >= 220) {
    form = "Hot";
    emoji = "🔥";
  } else if (score <= 120) {
    form = "Cold";
    emoji = "❄️";
  }

  const confidence = Math.max(
    1,
    Math.min(99, Math.round(score / 3))
  );

  return {
    score,
    form,
    emoji,
    confidence,
  };
}

function standardDeviation(values) {
  if (!values.length) return 0;

  const mean =
    values.reduce((a, b) => a + b, 0) /
    values.length;

  const variance =
    values.reduce(
      (sum, value) =>
        sum + Math.pow(value - mean, 2),
      0
    ) / values.length;

  return Math.sqrt(variance);
}