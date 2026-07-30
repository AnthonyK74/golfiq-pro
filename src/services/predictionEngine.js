import { calculateCourseFit } from "../utils/courseFit";

export function calculatePrediction(player, courseDNA = null) {
  const golfIQ = player.golfIQ;

  if (!golfIQ) return null;

  const courseFit = calculateCourseFit(player, courseDNA);

  if (!courseFit) return null;

  const ballStriking =
    golfIQ.metrics.ballStriking;

  const form = courseFit.form;

  const consistency =
    courseFit.consistency;

  const prediction =
    golfIQ.rating * 0.35 +
    courseFit.score * 0.30 +
    form * 0.15 +
    consistency * 0.10 +
    ballStriking * 0.10;

  const reasons = [];

  if (courseFit.score >= 85)
    reasons.push("Excellent course fit");

  if (ballStriking >= 85)
    reasons.push("Elite ball striking");

  if (form >= 85)
    reasons.push("Strong recent form");

  if (consistency >= 80)
    reasons.push("Very consistent");

  return {
    score: Number(prediction.toFixed(1)),
    courseFit,
    reasons,
  };
}