import { calculateCourseFit } from "./courseFit";

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function calculateTournamentPrediction(player) {
  if (!player || !player.averages) return null;

  const courseFit = calculateCourseFit(player);

  if (!courseFit) return null;

  const cgi = player.averages.cgi;
  const confidence = player.confidence ?? 50;
  const consistency = player.consistency ?? 3;

  const trendBonus =
    player.trend === "🔥 Hot"
      ? 8
      : player.trend === "📈 Improving"
      ? 4
      : player.trend === "➡ Stable"
      ? 0
      : -5;

  const rating =
    cgi * 6 +
    courseFit.score * 0.35 +
    confidence * 0.20 +
    consistency * 2 +
    trendBonus;

  const win = clamp(rating * 0.22);
  const top5 = clamp(win * 2.4);
  const top10 = clamp(top5 * 1.55);
  const top20 = clamp(top10 * 1.30);
  const makeCut = clamp(top20 + 10);

  return {
    rating: Number(rating.toFixed(1)),
    win: Number(win.toFixed(1)),
    top5: Number(top5.toFixed(1)),
    top10: Number(top10.toFixed(1)),
    top20: Number(top20.toFixed(1)),
    makeCut: Number(makeCut.toFixed(1)),
    courseFit,
  };
}

export function rankTournament(players) {
  return players
    .map((player) => ({
      ...player,
      prediction: calculateTournamentPrediction(player),
    }))
    .filter((player) => player.prediction)
    .sort(
      (a, b) =>
        b.prediction.rating - a.prediction.rating
    );
}