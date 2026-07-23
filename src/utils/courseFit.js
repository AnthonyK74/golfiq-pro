export function calculateCourseFit(player) {
  if (!player?.averages) return null;

  const stats = player.averages;

  const clamp = (value) =>
    Math.max(0, Math.min(100, value));

  const driving = clamp(
    50 +
      stats.sg_off_tee * 20 +
      (stats.driving_distance - 295) * 0.3 +
      (stats.driving_accuracy - 60) * 0.6
  );

  const approach = clamp(
    50 +
      stats.sg_approach * 22 +
      (stats.greens_in_regulation - 65) * 0.8
  );

  const shortGame = clamp(
    50 +
      stats.sg_around_green * 22 +
      (stats.scrambling - 55) * 0.7
  );

  const putting = clamp(
    50 +
      stats.sg_putting * 22 +
      stats.birdies * 2
  );

  const form =
    player.trend === "🔥 Hot"
      ? 100
      : player.trend === "📈 Improving"
      ? 85
      : player.trend === "➡ Stable"
      ? 70
      : player.trend === "📉 Cooling"
      ? 55
      : 40;

  const consistency =
    player.consistency ?? 70;

  const score =
    driving * 0.22 +
    approach * 0.33 +
    shortGame * 0.15 +
    putting * 0.15 +
    form * 0.10 +
    consistency * 0.05;

  let recommendation = "Average";

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
  else
    recommendation = "Poor Fit";

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