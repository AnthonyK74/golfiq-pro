function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

// PGA Tour strokes gained values are normally centred around 0.
// Scaling around ±2.5 gives much better separation between players.
function scaleSG(value) {
  return clamp(((Number(value) + 2.5) / 5) * 100);
}

function weightedAverage(values) {
  let total = 0;
  let weight = 0;

  values.forEach(({ value, weight: w }) => {
    total += value * w;
    weight += w;
  });

  return weight ? total / weight : 0;
}

export function calculateGolfIQRating(player) {
  const stats = player?.averages ?? {};

  // -------------------------
  // Strokes Gained
  // -------------------------

  const sgOTT = Number(stats.sg_off_tee ?? 0);
  const sgAPP = Number(stats.sg_approach ?? 0);
  const sgARG = Number(stats.sg_around_green ?? 0);
  const sgPUTT = Number(stats.sg_putting ?? 0);

  // -------------------------
  // Traditional Stats
  // -------------------------

  const drivingAccuracy = Number(
    stats.driving_accuracy ?? 60
  );

  const drivingDistance = Number(
    stats.driving_distance ?? 295
  );

  const greens = Number(
    stats.greens_in_regulation ?? 65
  );

  const scrambling = Number(
    stats.scrambling ?? 55
  );

  const consistency = Number(
    player.consistency ?? 70
  );

  const confidence = Number(
    player.confidence ?? 70
  );

  // -------------------------
  // Skill Ratings
  // -------------------------

  const offTee = scaleSG(sgOTT);

  const approach = scaleSG(sgAPP);

  const aroundGreen = scaleSG(sgARG);

  const putting = scaleSG(sgPUTT);

  const ballStriking =
    offTee * 0.45 +
    approach * 0.55;

  const shortGame =
    aroundGreen * 0.40 +
    putting * 0.60;

  // -------------------------
  // Combined Golf Index
  // -------------------------

  const cgi =
    sgAPP * 1.5 +
    sgOTT * 1.2 +
    sgPUTT +
    sgARG * 0.8;

  const cgiScore = clamp(
    50 + cgi * 4
  );

  // -------------------------
  // Category Scores
  // -------------------------

  const ballStrikingScore =
    weightedAverage([
      { value: offTee, weight: 30 },
      { value: approach, weight: 45 },
      { value: greens, weight: 15 },
      {
        value: clamp((drivingDistance - 280) * 2),
        weight: 10,
      },
    ]);

  const scoringScore =
    weightedAverage([
      { value: putting, weight: 40 },
      { value: scrambling, weight: 25 },
      { value: cgiScore, weight: 35 },
    ]);

  const formScore = clamp(
    confidence * 0.6 +
    consistency * 0.4
  );

  let rating =
    ballStrikingScore * 0.45 +
    scoringScore * 0.25 +
    formScore * 0.15 +
    consistency * 0.15;

  if (
    ballStrikingScore > 90 &&
    scoringScore > 85
  ) {
    rating += 3;
  }

  rating = clamp(rating);

  // -------------------------
  // Return
  // -------------------------

  return {
    rating: Number(rating.toFixed(2)),

    cgi: Number(cgi.toFixed(2)),

    // Raw category scores for GolfIQ V3
    raw: {
      ballStriking: ballStrikingScore,
      scoring: scoringScore,
      form: formScore,
      consistency,
    },

    metrics: {
      ballStrikingScore: Number(ballStrikingScore.toFixed(1)),
      scoringScore: Number(scoringScore.toFixed(1)),

      ballStriking: Number(ballStriking.toFixed(1)),
      shortGame: Number(shortGame.toFixed(1)),

      offTee: Number(offTee.toFixed(1)),
      approach: Number(approach.toFixed(1)),
      aroundGreen: Number(aroundGreen.toFixed(1)),
      putting: Number(putting.toFixed(1)),

      drivingAccuracy,
      drivingDistance,
      greens,
      scrambling,

      consistency,
      confidence,

      cgiScore: Number(cgiScore.toFixed(1)),
    },
  };
}