export function calculateCourseFit(player) {
  if (!player?.averages) return null;

  const stats = player.averages;

  const driving =
    Math.max(0, Math.min(100, 50 + stats.sg_off_tee * 25));

  const approach =
    Math.max(0, Math.min(100, 50 + stats.sg_approach * 25));

  const shortGame =
    Math.max(0, Math.min(100, 50 + stats.sg_around_green * 25));

  const putting =
    Math.max(0, Math.min(100, 50 + stats.sg_putting * 25));

  const form =
    player.trend === "🔥 Hot"
      ? 100
      : player.trend === "📈 Improving"
      ? 80
      : player.trend === "➡ Stable"
      ? 65
      : 40;

  const score =
    driving * 0.25 +
    approach * 0.40 +
    shortGame * 0.15 +
    putting * 0.15 +
    form * 0.05;

  let recommendation = "Average";

  if (score >= 90) recommendation = "Excellent";
  else if (score >= 80) recommendation = "Very Good";
  else if (score >= 70) recommendation = "Good";
  else if (score >= 60) recommendation = "Playable";

  return {
    score: Number(score.toFixed(1)),
    driving,
    approach,
    shortGame,
    putting,
    form,
    recommendation,
  };
}