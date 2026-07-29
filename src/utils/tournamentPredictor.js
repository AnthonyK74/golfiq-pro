import { calculateFieldStrength } from "./fieldStrength";
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
console.log(
  player.player.display_name,
  "Rating:", rating.toFixed(2),
  "Strength:", strength.toFixed(2)
);
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
    const fieldStrength = calculateFieldStrength(players);
  const ranked = players
    .map((player) => {
      const prediction = calculateTournamentPrediction(player);
if (prediction) {
  prediction.rating = Number(
    (prediction.rating * fieldStrength).toFixed(2)
  );
}

      if (!prediction) return null;

      return {
        ...player,
        prediction,
        trend: prediction.trend,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.prediction.rating - a.prediction.rating);

  if (ranked.length === 0) return [];

  const ratings = ranked.map((p) => p.prediction.rating);

  const max = Math.max(...ratings);
  const min = Math.min(...ratings);
  const range = Math.max(max - min, 1);

  ranked.forEach((player) => {
    // Normalize to 0–1 across the whole field
    const strength =
      (player.prediction.rating - min) / range;

    // Non-linear scaling gives better separation at the top
    const elite = Math.pow(strength, 0.65);

    player.prediction.win = Number(
      (0.5 + elite * 17.5).toFixed(1)
    );

    player.prediction.top5 = Number(
      (4 + elite * 41).toFixed(1)
    );

    player.prediction.top10 = Number(
      (10 + elite * 60).toFixed(1)
    );

    player.prediction.top20 = Number(
      (20 + elite * 70).toFixed(1)
    );

    player.prediction.makeCut = Number(
      (65 + elite * 34).toFixed(1)
    );
  });

  return ranked;
}