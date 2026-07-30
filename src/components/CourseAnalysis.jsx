export function calculateCourseFit(player, courseDNA = null) {
  if (!player?.averages) return null;

  const stats = player.averages;

  const clamp = (value, min = 0, max = 100) =>
    Math.max(min, Math.min(max, value));

  // ----------------------------
  // Individual Skill Ratings
  // ----------------------------

  const driving = clamp(
    50 +
      (stats.sg_off_tee || 0) * 20 +
      ((stats.driving_distance || 295) - 295) * 0.30 +
      ((stats.driving_accuracy || 60) - 60) * 0.60
  );

  const approach = clamp(
    50 +
      (stats.sg_approach || 0) * 22 +
      ((stats.greens_in_regulation || 65) - 65) * 0.80
  );

  const shortGame = clamp(
    50 +
      (stats.sg_around_green || 0) * 22 +
      ((stats.scrambling || 55) - 55) * 0.70
  );

  const putting = clamp(
    50 +
      (stats.sg_putting || 0) * 22 +
      (stats.birdies || 0) * 2
  );

  // ----------------------------
  // Form
  // ----------------------------

  let form = 50;

  switch (player.trend) {
    case "🔥 Hot":
      form = 100;
      break;

    case "📈 Improving":
      form = 85;
      break;

    case "➡ Stable":
      form = 70;
      break;

    case "📉 Cooling":
      form = 55;
      break;

    default:
      form = 40;
  }

  const consistency = clamp(player.consistency ?? 70);

  // ----------------------------
  // Course DNA
  // ----------------------------

  const weights =
    courseDNA ?? {
      approach: 33,
      offTee: 22,
      aroundGreen: 15,
      putting: 15,
      accuracy: 10,
      scrambling: 5,
    };

  // ----------------------------
  // Core Course Score
  // ----------------------------

  const courseScore =
    driving *
      ((weights.offTee + weights.accuracy) / 100) +
    approach *
      (weights.approach / 100) +
    shortGame *
      ((weights.aroundGreen + weights.scrambling) / 100) +
    putting *
      (weights.putting / 100);

  // ----------------------------
  // Apply Bonuses
  // ----------------------------

  const score = clamp(
    courseScore * 0.85 +
      form * 0.10 +
      consistency * 0.05
  );

  // ----------------------------
  // Recommendation
  // ----------------------------

  let recommendation = "Poor Fit";

  if (score >= 95)
    recommendation = "Elite";
  else if (score >= 90)
    recommendation = "Excellent";
  else if (score >= 80)
    recommendation = "Very Good";
  else if (score >= 70)
    recommendation = "Good";
  else if (score >= 60)
    recommendation = "Playable";

  return {
    score: Number(score.toFixed(1)),
    driving: Number(driving.toFixed(1)),
    approach: Number(approach.toFixed(1)),
    shortGame: Number(shortGame.toFixed(1)),
    putting: Number(putting.toFixed(1)),
    form,
    consistency,
    recommendation,
  };
}