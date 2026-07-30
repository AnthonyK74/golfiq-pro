function average(players, field) {
  if (!players.length) return 0;

  const values = players
    .map((player) => Number(player[field]))
    .filter((value) => !Number.isNaN(value));

  if (!values.length) return 0;

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  );
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function normaliseSG(value) {
  // PGA Strokes Gained is typically between -2 and +2
  return clamp(((value + 2) / 4) * 100);
}

function normalisePercentage(value) {
  // Convert percentages (0–100) directly to a 0–100 score
  return clamp(value);
}

export function calculateCourseFit(players) {
  if (!players.length) {
    return {
      overall: 0,
      driving: 0,
      approach: 0,
      shortGame: 0,
      putting: 0,
    };
  }

  const driving =
    normaliseSG(average(players, "sg_off_tee")) * 0.70 +
    normalisePercentage(average(players, "driving_accuracy")) * 0.30;

  const approach =
    normaliseSG(average(players, "sg_approach")) * 0.80 +
    normalisePercentage(average(players, "greens_in_regulation")) * 0.20;

  const shortGame =
    normaliseSG(average(players, "sg_around_green"));

  const putting =
    normaliseSG(average(players, "sg_putting"));

  const overall =
    driving * 0.25 +
    approach * 0.35 +
    shortGame * 0.20 +
    putting * 0.20;

  return {
    overall: Math.round(overall),
    driving: Math.round(driving),
    approach: Math.round(approach),
    shortGame: Math.round(shortGame),
    putting: Math.round(putting),
  };
}