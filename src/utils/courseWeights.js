export function generateCourseWeights(profile) {
  if (!profile) return null;

  const total = Object.values(profile).reduce(
    (sum, stat) => sum + stat.importance,
    0
  );

  const weights = {};

  Object.entries(profile).forEach(([key, value]) => {
    weights[key] =
      total === 0
        ? 0
        : Number((value.importance / total).toFixed(3));
  });

  return weights;
}