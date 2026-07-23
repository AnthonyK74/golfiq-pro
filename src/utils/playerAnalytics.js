export function average(rounds, field) {
  if (!rounds.length) return 0;

  return (
    rounds.reduce(
      (sum, round) => sum + (Number(round[field]) || 0),
      0
    ) / rounds.length
  );
}

export function calculateCGI(stats) {
  return (
    stats.sg_approach * 1.5 +
    stats.sg_off_tee * 1.2 +
    stats.sg_putting +
    stats.sg_around_green * 0.8
  );
}

export function calculateTrendValue(history) {
  if (history.length < 2) return 0;

  const latest = Number(history[0]?.sg_total ?? 0);
  const oldest = Number(
    history[history.length - 1]?.sg_total ?? 0
  );

  return latest - oldest;
}

export function calculateTrend(history) {
  const value = calculateTrendValue(history);

  if (value >= 1.0) return "🔥 Hot";
  if (value >= 0.4) return "📈 Improving";
  if (value <= -1.0) return "❄️ Cold";
  if (value <= -0.4) return "📉 Cooling";

  return "➡ Stable";
}

export function calculateConsistency(history) {
  if (history.length < 2) return 70;

  const values = history.map((r) =>
    Number(r.sg_total ?? 0)
  );

  const mean =
    values.reduce((a, b) => a + b, 0) /
    values.length;

  const variance =
    values.reduce(
      (sum, value) =>
        sum + Math.pow(value - mean, 2),
      0
    ) / values.length;

  const sd = Math.sqrt(variance);

  const score = Math.max(
    40,
    Math.min(100, 100 - sd * 20)
  );

  return Math.round(score);
}

export function getStrengths(stats) {
  const strengths = [];

  if (stats.sg_approach >= 1)
    strengths.push("🎯 Elite Iron Play");

  if (stats.sg_off_tee >= 1)
    strengths.push("🚀 Elite Driving");

  if (stats.sg_putting >= 1)
    strengths.push("⛳ Elite Putting");

  if (stats.sg_around_green >= 0.8)
    strengths.push("🌱 Elite Short Game");

  if (stats.driving_accuracy >= 65)
    strengths.push("🎯 Accurate Driver");

  if (stats.greens_in_regulation >= 70)
    strengths.push("🟢 GIR Machine");

  if (!strengths.length)
    strengths.push("⚖️ Balanced");

  return strengths;
}

export function getWeaknesses(stats) {
  const weaknesses = [];

  if (stats.sg_approach < 0)
    weaknesses.push("Iron Play");

  if (stats.sg_off_tee < 0)
    weaknesses.push("Driving");

  if (stats.sg_putting < 0)
    weaknesses.push("Putting");

  if (stats.sg_around_green < 0)
    weaknesses.push("Short Game");

  return weaknesses;
}

export function calculatePredictionScore(
  averages,
  trendValue,
  consistency
) {
  return (
    averages.cgi * 8 +
    averages.sg_total * 12 +
    trendValue * 10 +
    consistency * 0.4
  );
}

export function calculateConfidence(score) {
  return Math.round(
    Math.max(0, Math.min(100, score))
  );
}

export function calculatePlayerAnalytics(rounds) {
  if (!rounds.length) return null;

  const history = [...rounds]
    .sort(
      (a, b) =>
        new Date(b.tournament?.start_date ?? 0) -
        new Date(a.tournament?.start_date ?? 0)
    )
    .slice(0, 5);

  const latest = history[0];

  const averages = {
    tournaments: history.length,

    sg_off_tee: average(history, "sg_off_tee"),
    sg_approach: average(history, "sg_approach"),
    sg_around_green: average(
      history,
      "sg_around_green"
    ),
    sg_putting: average(history, "sg_putting"),
    sg_total: average(history, "sg_total"),

    driving_distance: average(
      history,
      "driving_distance"
    ),
    driving_accuracy: average(
      history,
      "driving_accuracy"
    ),
    greens_in_regulation: average(
      history,
      "greens_in_regulation"
    ),
    scrambling: average(
      history,
      "scrambling"
    ),

    birdies: average(history, "birdies"),
    eagles: average(history, "eagles"),
  };

  averages.cgi = calculateCGI(averages);

  const trendValue =
    calculateTrendValue(history);

  const trend =
    calculateTrend(history);

  const consistency =
    calculateConsistency(history);

  const predictionScore =
    calculatePredictionScore(
      averages,
      trendValue,
      consistency
    );

  const confidence =
    calculateConfidence(predictionScore);

  return {
    ...latest,

    averages,

    history,

    trend,

    trendValue,

    consistency,

    predictionScore,

    confidence,

    strengths: getStrengths(
      averages
    ),

    weaknesses: getWeaknesses(
      averages
    ),
  };
}