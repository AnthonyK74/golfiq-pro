export function calculateGolfIQRating(player) {
  const averages = player?.averages ?? {};

  const sgOTT = Number(averages.sg_off_tee ?? 0);
  const sgAPP = Number(averages.sg_approach ?? 0);
  const sgARG = Number(averages.sg_around_green ?? 0);
  const sgPUTT = Number(averages.sg_putting ?? 0);

  const drivingAccuracy = Number(averages.driving_accuracy ?? 0);
  const greens = Number(averages.greens_in_regulation ?? 0);
  const scrambling = Number(averages.scrambling ?? 0);
  const birdies = Number(averages.birdies ?? 0);
  const eagles = Number(averages.eagles ?? 0);

  const cgi =
    sgAPP * 1.5 +
    sgOTT * 1.2 +
    sgPUTT +
    sgARG * 0.8;

  const rating =
    cgi * 8 +
    drivingAccuracy * 0.12 +
    greens * 0.18 +
    scrambling * 0.10 +
    birdies * 2 +
    eagles * 5;

  let grade = "C";

  if (rating >= 95) grade = "S";
  else if (rating >= 90) grade = "A+";
  else if (rating >= 85) grade = "A";
  else if (rating >= 80) grade = "A-";
  else if (rating >= 75) grade = "B+";
  else if (rating >= 70) grade = "B";
  else if (rating >= 65) grade = "B-";
  else if (rating >= 60) grade = "C+";
  else if (rating >= 50) grade = "C";
  else grade = "D";

  return {
    rating: Number(rating.toFixed(2)),
    cgi: Number(cgi.toFixed(2)),
    grade,
    breakdown: {
      sgOTT,
      sgAPP,
      sgARG,
      sgPUTT,
      drivingAccuracy,
      greens,
      scrambling,
      birdies,
      eagles,
    },
  };
}