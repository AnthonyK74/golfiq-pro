function average(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function getValue(player, field) {
  return Number(player[field] ?? 0);
}

export function buildCourseProfile(results = []) {
  if (!results.length) return null;

  // Assume results already contain finishing_position
  const sorted = [...results].sort(
    (a, b) => a.finishing_position - b.finishing_position
  );

  const top10 = sorted.slice(0, 10);

  const stats = [
    "sg_approach",
    "sg_off_tee",
    "sg_putting",
    "sg_around_green",
    "greens_in_regulation",
    "driving_accuracy",
    "driving_distance",
    "scrambling",
    "birdies",
    "eagles"
  ];

  const profile = {};

  stats.forEach((stat) => {
    const topAverage = average(
      top10.map((p) => getValue(p, stat))
    );

    const fieldAverage = average(
      sorted.map((p) => getValue(p, stat))
    );

    const importance = Math.abs(topAverage - fieldAverage);

    profile[stat] = {
      topAverage: Number(topAverage.toFixed(2)),
      fieldAverage: Number(fieldAverage.toFixed(2)),
      importance: Number(importance.toFixed(2))
    };
  });

  return profile;
}