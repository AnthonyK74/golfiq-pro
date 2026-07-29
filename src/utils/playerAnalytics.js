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

export function calculateExperienceScore(tournaments) {
  if (tournaments >= 5) return 100;
  if (tournaments === 4) return 90;
  if (tournaments === 3) return 80;
  if (tournaments === 2) return 65;
  if (tournaments === 1) return 45;

  return 40;
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

export function calculateConfidence(
  consistency,
  tournaments,
  trend,
  predictionScore
) {
  const experience =
    calculateExperienceScore(tournaments);

  let trendScore = 75;

  if (trend === "🔥 Hot") trendScore = 100;
  else if (trend === "📈 Improving") trendScore = 90;
  else if (trend === "➡ Stable") trendScore = 80;
  else if (trend === "📉 Cooling") trendScore = 65;
  else if (trend === "❄️ Cold") trendScore = 50;

  const predictionStrength = Math.min(
    100,
    Math.max(40, predictionScore / 4)
  );

  const confidence =
    consistency * 0.35 +
    experience * 0.30 +
    trendScore * 0.20 +
    predictionStrength * 0.15;

  return Math.round(confidence);
}

export function calculatePlayerAnalytics(rounds) {
  if (!rounds.length) return null;

  const sortedRounds = [...rounds].sort(
    (a, b) =>
      new Date(b.tournament?.start_date ?? 0) -
      new Date(a.tournament?.start_date ?? 0)
  );

  // Keep only one record per tournament (latest five tournaments)
  const uniqueHistory = [];
  const seen = new Set();

  for (const round of sortedRounds) {
    const tournamentId = round.tournament?.id;

    if (!seen.has(tournamentId)) {
      seen.add(tournamentId);
      uniqueHistory.push(round);
    }

    if (uniqueHistory.length === 5) break;
  }

  if (!uniqueHistory.length) return null;

  const latest = uniqueHistory[0];

  const averages = {
    tournaments: uniqueHistory.length,

    sg_off_tee: average(uniqueHistory, "sg_off_tee"),
    sg_approach: average(uniqueHistory, "sg_approach"),
    sg_around_green: average(
      uniqueHistory,
      "sg_around_green"
    ),
    sg_putting: average(uniqueHistory, "sg_putting"),
    sg_total: average(uniqueHistory, "sg_total"),

    driving_distance: average(
      uniqueHistory,
      "driving_distance"
    ),
    driving_accuracy: average(
      uniqueHistory,
      "driving_accuracy"
    ),
    greens_in_regulation: average(
      uniqueHistory,
      "greens_in_regulation"
    ),
    scrambling: average(
      uniqueHistory,
      "scrambling"
    ),

    birdies: average(uniqueHistory, "birdies"),
    eagles: average(uniqueHistory, "eagles"),
  };

  averages.cgi = calculateCGI(averages);

  const trendValue =
    calculateTrendValue(uniqueHistory);

  const trend =
    calculateTrend(uniqueHistory);

  const consistency =
    calculateConsistency(uniqueHistory);

  const predictionScore =
    calculatePredictionScore(
      averages,
      trendValue,
      consistency
    );

  const experienceScore =
    calculateExperienceScore(
      uniqueHistory.length
    );

  const confidence =
    calculateConfidence(
      consistency,
      uniqueHistory.length,
      trend,
      predictionScore
    );

  return {
    ...latest,

    averages,

    history: uniqueHistory,

    trend,

    trendValue,

    consistency,

    experienceScore,

    predictionScore,

    confidence,

    strengths: getStrengths(averages),

    weaknesses: getWeaknesses(averages),
  };
}