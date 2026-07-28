function cap(value, min = -2, max = 2) {
  return Math.max(min, Math.min(max, value));
}

function scaleStat(value) {
  // Converts strokes gained (-2 to +2) into a 0-100 score
  return ((cap(value) + 2) / 4) * 100;
}

export function calculateGolfIQRating(player) {
  const averages = player?.averages ?? {};

  // Strokes Gained
  const sgOTT = Number(averages.sg_off_tee ?? 0);
  const sgAPP = Number(averages.sg_approach ?? 0);
  const sgARG = Number(averages.sg_around_green ?? 0);
  const sgPUTT = Number(averages.sg_putting ?? 0);

  // Traditional stats
  const drivingAccuracy = Number(
    averages.driving_accuracy ?? 0
  );

  const greens = Number(
    averages.greens_in_regulation ?? 0
  );

  const scrambling = Number(
    averages.scrambling ?? 0
  );

  const consistency = Number(
    player.consistency ?? 70
  );

  const confidence = Number(
    player.confidence ?? 70
  );

  // -----------------------------
  // Category Scores (0-100)
  // -----------------------------

  const offTee = scaleStat(sgOTT);

  const approach = scaleStat(sgAPP);

  const aroundGreen = scaleStat(sgARG);

  const putting = scaleStat(sgPUTT);

  const ballStriking =
    offTee * 0.45 +
    approach * 0.55;

  const shortGame =
    aroundGreen * 0.45 +
    putting * 0.55;

  // Combined Golf Index
  const cgi =
    sgAPP * 1.5 +
    sgOTT * 1.2 +
    sgPUTT +
    sgARG * 0.8;

  // -----------------------------
  // Raw GolfIQ Rating
  // -----------------------------

  const rating =
    ballStriking * 0.40 +
    shortGame * 0.20 +
    greens * 0.15 +
    drivingAccuracy * 0.05 +
    scrambling * 0.05 +
    consistency * 0.10 +
    confidence * 0.05;

  return {
    rating: Number(rating.toFixed(2)),

    cgi: Number(cgi.toFixed(2)),

    metrics: {
      ballStriking: Number(ballStriking.toFixed(1)),
      shortGame: Number(shortGame.toFixed(1)),
      offTee: Number(offTee.toFixed(1)),
      approach: Number(approach.toFixed(1)),
      aroundGreen: Number(aroundGreen.toFixed(1)),
      putting: Number(putting.toFixed(1)),
      drivingAccuracy,
      greens,
      scrambling,
      consistency,
      confidence,
    },
  };
}