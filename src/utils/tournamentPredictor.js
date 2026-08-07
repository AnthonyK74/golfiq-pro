import { calculateFieldStrength } from "./fieldStrength";
import { calculateCourseFit } from "./courseFit";
import { calculateGolfIQRating } from "../services/golfiqRating";
import { calculateTournamentHistory } from "./tournamentHistory";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Number(value.toFixed(2));
}

function buildReasons(golfIQ, courseFit) {
  const reasons = [];

  if (golfIQ.rating >= 90)
    reasons.push("Elite GolfIQ Rating");

  if (courseFit.score >= 90)
    reasons.push("Excellent course fit");

  if (courseFit.approach >= 85)
    reasons.push("Outstanding approach play");

  if (courseFit.driving >= 85)
    reasons.push("Strong driving performance");

  if (courseFit.putting >= 85)
    reasons.push("Reliable putting");

  if (courseFit.shortGame >= 85)
    reasons.push("Excellent short game");

  if (courseFit.form >= 85)
    reasons.push("Arrives in excellent form");

  if (courseFit.consistency >= 85)
    reasons.push("Highly consistent");

  if (reasons.length === 0)
    reasons.push("Well-rounded statistical profile");

  return reasons;
}

export function calculateTournamentPrediction(player, courseDNA = null) {
  if (!player?.averages) return null;

  const golfIQ = calculateGolfIQRating(player);
  const courseFit = calculateCourseFit(player, courseDNA);

  if (!courseFit) return null;

  let eliteBonus = 0;

if (golfIQ.rating >= 95) eliteBonus = 4;
else if (golfIQ.rating >= 92) eliteBonus = 3;
else if (golfIQ.rating >= 90) eliteBonus = 2;
else if (golfIQ.rating >= 87) eliteBonus = 1;

let formBonus = 0;

switch (player.trend) {
  case "🔥 Hot":
    formBonus = 3;
    break;
  case "📈 Improving":
    formBonus = 2;
    break;
  case "➡ Stable":
    formBonus = 1;
    break;
  case "📉 Cooling":
    formBonus = 0;
    break;
  default:
    formBonus = -2;
}

const rating =
  golfIQ.rating * 0.55 +
  courseFit.score * 0.25 +
  courseFit.consistency * 0.10 +
  courseFit.form * 0.10 +
  eliteBonus +
  formBonus;

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

    reasons: buildReasons(golfIQ, courseFit),
  };
}

export function rankTournament(players = [], courseDNA = null) {
  const fieldStrength = calculateFieldStrength(players);

  const ranked = players
    .map((player) => {
      const prediction = calculateTournamentPrediction(player, courseDNA);

      if (!prediction) return null;

      prediction.rating = Number(
        (prediction.rating * fieldStrength).toFixed(2)
      );

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
    const strength =
      (player.prediction.rating - min) / range;

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