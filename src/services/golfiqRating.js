function cap(value, min = -2, max = 2) {
  return Math.max(min, Math.min(max, value));
}
export function calculateGolfIQRating(player) {
  const averages = player?.averages ?? {};

  const sgOTT = cap(Number(averages.sg_off_tee ?? 0));
const sgAPP = cap(Number(averages.sg_approach ?? 0));
const sgARG = cap(Number(averages.sg_around_green ?? 0));
const sgPUTT = cap(Number(averages.sg_putting ?? 0));

  const drivingAccuracy = Number(averages.driving_accuracy ?? 0);
  const greens = Number(averages.greens_in_regulation ?? 0);
  const scrambling = Number(averages.scrambling ?? 0);

  const consistency = Number(player?.consistency ?? 70);
  const confidence = Number(player?.confidence ?? 70);

  const cgi =
    sgAPP * 1.6 +
    sgOTT * 1.3 +
    sgPUTT * 1.0 +
    sgARG * 0.7;

  const ballStriking =
    sgAPP * 2.0 +
    sgOTT * 1.5;

  const shortGame =
    sgPUTT +
    sgARG;

  const rating =
    ballStriking * 18 +
    shortGame * 8 +
    greens * 0.25 +
    drivingAccuracy * 0.10 +
    scrambling * 0.10 +
    consistency * 0.35 +
    confidence * 0.25;

  let grade = "D";

  if (rating >= 175) grade = "S";
  else if (rating >= 160) grade = "A+";
  else if (rating >= 145) grade = "A";
  else if (rating >= 130) grade = "A-";
  else if (rating >= 115) grade = "B+";
  else if (rating >= 100) grade = "B";
  else if (rating >= 85) grade = "B-";
  else if (rating >= 70) grade = "C+";
  else if (rating >= 55) grade = "C";

console.log({
  player: `${player.player.first_name} ${player.player.last_name}`,
  rating: rating.toFixed(2),
  cgi: cgi.toFixed(2),
  ballStriking: ballStriking.toFixed(2),
  shortGame: shortGame.toFixed(2),
  consistency,
  confidence,
  sgAPP,
  sgOTT,
  sgARG,
  sgPUTT,
});

  return {
    rating: Number(rating.toFixed(2)),
    cgi: Number(cgi.toFixed(2)),
    grade,
    breakdown: {
      sgOTT,
      sgAPP,
      sgARG,
      sgPUTT,
      ballStriking,
      shortGame,
      drivingAccuracy,
      greens,
      scrambling,
      consistency,
      confidence,
    },
  };
}