import { calculateCourseFit } from "./courseFit";
import { calculateGolfIQRating } from "../services/golfiqRating";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Number(value.toFixed(2));
}

export function calculateTournamentPrediction(player) {
  if (!player?.averages) return null;

  const courseFit = calculateCourseFit(player);

  if (!courseFit) return null;

  const averages = player.averages;
  const { rating: golfIQRating } = calculateGolfIQRating(player);

  const trend =
    player.trend ??
    (player.formTrend ?? "➡ Stable");

  const trendBonus =
    trend === "🔥 Hot"
      ? 5
      : trend === "📈 Improving"
      ? 3
      : trend === "➡ Stable"
      ? 0
      : -3;

  const confidence = player.confidence ?? 70;
  const consistency = player.consistency ?? 70;

  const rating =
    golfIQRating * 0.35 +
    (averages.cgi ?? 0) * 4.5 +
    (averages.sg_approach ?? 0) * 18 +
    (averages.sg_off_tee ?? 0) * 12 +
    (averages.sg_putting ?? 0) * 10 +
    (averages.sg_around_green ?? 0) * 8 +
    (averages.sg_total ?? 0) * 6 +
    (averages.greens_in_regulation ?? 0) * 0.18 +
    (averages.driving_accuracy ?? 0) * 0.12 +
    (averages.scrambling ?? 0) * 0.10 +
    (averages.birdies ?? 0) * 1.8 +
    (averages.eagles ?? 0) * 4 +
    (courseFit.score ?? 0) * 0.45 +
    confidence * 0.10 +
    consistency * 0.08 +
    trendBonus;

  const strength = rating / 2.4;

  const win = clamp(strength * 0.32, 0, 35);
  const top5 = clamp(win * 2.45, win, 60);
  const top10 = clamp(top5 * 1.55, top5, 82);
  const top20 = clamp(top10 * 1.22, top10, 96);
  const makeCut = clamp(top20 + 8, 55, 99);

  return {
    golfIQRating: round(golfIQRating),
    rating: round(rating),
    win: round(win),
    top5: round(top5),
    top10: round(top10),
    top20: round(top20),
    makeCut: round(makeCut),
    confidence: round(confidence),
    consistency: round(consistency),
    courseFit,
    trend,
  };
}

export function rankTournament(players = []) {
  return players
    .map((player) => {
      const prediction = calculateTournamentPrediction(player);

      if (!prediction) return null;

      return {
        ...player,
        prediction,
        trend: prediction.trend,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        b.prediction.rating - a.prediction.rating
    );
}