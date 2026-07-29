export function calculateFieldStrength(players = []) {
  if (!players.length) return 1;

  const ratings = players
    .map((player) => player.golfIQ?.rating)
    .filter((rating) => typeof rating === "number" && !isNaN(rating));

  if (!ratings.length) return 1;

  const averageRating =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  // PGA Tour average field = 1.00
  let multiplier = averageRating / 75;

  // Keep it realistic
  multiplier = Math.max(0.90, Math.min(1.15, multiplier));

  return Number(multiplier.toFixed(3));
}