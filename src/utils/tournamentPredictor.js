import { calculateFieldStrength } from "./fieldStrength";
import { calculateCourseFit } from "./courseFit";
import { calculateGolfIQRating } from "../services/golfiqRating";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Number(value.toFixed(2));
}

export function calculateTournamentPrediction(player, courseDNA = null) {
  if (!player?.averages) return null;

  const golfIQ = calculateGolfIQRating(player);
  const courseFit = calculateCourseFit(player, courseDNA);

  if (!courseFit) return null;

  const rating =
  golfIQ.rating * 0.35 +
  courseFit.score * 0.25 +
  courseFit.driving * 0.10 +
  courseFit.approach * 0.10 +
  courseFit.shortGame * 0.05 +
  courseFit.putting * 0.05 +
  courseFit.form * 0.05 +
  courseFit.consistency * 0.05;

  return {
    golfIQRating: round(golfIQ.rating),
    rating: round(rating),
    win: round(clamp((rating - 60) * 0.8, 0, 35)),
    top5: round(clamp((rating - 50) * 1.2, 0, 60)),
    top10: round(clamp((rating - 40) * 1.4, 0, 80)),
    top20: round(clamp((rating - 30) * 1.5, 0, 95)),
    makeCut: round(clamp((rating - 20) * 1.2, 60, 99)),
    confidence: round(courseFit.consistency),
    consistency: round(courseFit.consistency),
    courseFit,
    trend: player.trend,
  };
}

export function rankTournament(players = [], courseDNA = null) {
    const fieldStrength = calculateFieldStrength(players);
  const ranked = players
    .map((player) => {
      const prediction = calculateTournamentPrediction(player, courseDNA);
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