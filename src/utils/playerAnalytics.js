export function average(rounds, field) {
  if (!rounds.length) return 0;

  return (
    rounds.reduce((sum, round) => sum + (Number(round[field]) || 0), 0) /
    rounds.length
  );
}

export function calculateCGI(stats) {
  return (
    stats.sg_approach * 1.5 +
    stats.sg_off_tee * 1.2 +
    stats.sg_putting * 1.0 +
    stats.sg_around_green * 0.8
  );
}

export function calculateTrend(history) {
  const value = calculateTrendValue(history);

  if (value > 0.50) return "🔥 Hot";
  if (value > 0.15) return "📈 Improving";
  if (value < -0.50) return "📉 Cooling";

  return "➡ Stable";
}

export function calculateTrendValue(history) {
  if (history.length < 2) return 0;

  const latest = Number(history[0]?.sg_total ?? 0);
  const oldest = Number(history[history.length - 1]?.sg_total ?? 0);

  return latest - oldest;
}

export function calculateConsistency(history) {
  if (history.length < 2) return 5;

  const values = history.map((h) => Number(h.sg_total ?? 0));

  const mean =
    values.reduce((a, b) => a + b, 0) / values.length;

  const variance =
    values.reduce((sum, value) => {
      return sum + Math.pow(value - mean, 2);
    }, 0) / values.length;

  const sd = Math.sqrt(variance);

  if (sd < 0.30) return 5;
  if (sd < 0.60) return 4;
  if (sd < 0.90) return 3;
  if (sd < 1.20) return 2;

  return 1;
}

export function getStrengths(stats) {
  const strengths = [];

  if (stats.sg_approach > 1)
    strengths.push("🎯 Elite Iron Player");

  if (stats.sg_off_tee > 1)
    strengths.push("🏌️ Elite Driver");

  if (stats.sg_putting > 1)
    strengths.push("⛳ Elite Putter");

  if (stats.sg_around_green > 0.8)
    strengths.push("🌱 Elite Short Game");

  if (strengths.length === 0)
    strengths.push("⚖️ Balanced Player");

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
  const cgiComponent = averages.cgi * 8;

  const trendComponent = trendValue * 12;

  const consistencyComponent = consistency * 4;

  return (
    cgiComponent +
    trendComponent +
    consistencyComponent
  );
}

export function calculateConfidence(score) {
  const confidence = Math.max(
    0,
    Math.min(100, score)
  );

  return Math.round(confidence);
}

export function calculatePlayerAnalytics(rounds) {
  if (!rounds.length) return null;

  const latest = rounds[0];

  const averages = {
    tournaments: rounds.length,

    sg_off_tee: average(rounds, "sg_off_tee"),
    sg_approach: average(rounds, "sg_approach"),
    sg_around_green: average(rounds, "sg_around_green"),
    sg_putting: average(rounds, "sg_putting"),
    sg_total: average(rounds, "sg_total"),

    driving_distance: average(rounds, "driving_distance"),
    driving_accuracy: average(rounds, "driving_accuracy"),
    greens_in_regulation: average(
      rounds,
      "greens_in_regulation"
    ),
    scrambling: average(rounds, "scrambling"),

    birdies: average(rounds, "birdies"),
    eagles: average(rounds, "eagles"),
  };

  averages.cgi = calculateCGI(averages);

  const history = [...rounds]
    .sort(
      (a, b) =>
        new Date(b.tournament?.start_date ?? 0) -
        new Date(a.tournament?.start_date ?? 0)
    )
    .slice(0, 5);

  const trendValue = calculateTrendValue(history);

  const trend = calculateTrend(history);

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

    strengths: getStrengths(averages),

    weaknesses: getWeaknesses(averages),
  };
}