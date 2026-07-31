export default function FieldStrengthCard({ players = [] }) {
  if (!players.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-green-400">
          Field Strength
        </h2>

        <p className="text-slate-400">
          No player data available.
        </p>
      </div>
    );
  }

  const ratings = players.map(
    (p) => p.golfIQ?.rating ?? 0
  );

  const average =
    ratings.reduce((sum, value) => sum + value, 0) /
    ratings.length;

  const elitePlayers = ratings.filter(
    (rating) => rating >= 90
  ).length;

  const topPlayers = ratings.filter(
    (rating) => rating >= 80
  ).length;

  function stars(score) {
    if (score >= 90) return "★★★★★";
    if (score >= 80) return "★★★★☆";
    if (score >= 70) return "★★★☆☆";
    if (score >= 60) return "★★☆☆☆";
    return "★☆☆☆☆";
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-green-400">
        Field Strength
      </h2>

      <div className="mb-6 text-center">
        <div className="text-5xl font-bold text-white">
          {average.toFixed(1)}
        </div>

        <div className="mt-2 text-yellow-400 text-2xl">
          {stars(average)}
        </div>
      </div>

      <div className="space-y-3">

        <StatRow
          label="Field Size"
          value={players.length}
        />

        <StatRow
          label="Elite Players"
          value={elitePlayers}
        />

        <StatRow
          label="Top Players"
          value={topPlayers}
        />

      </div>

    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-800 pb-2">
      <span className="text-slate-400">
        {label}
      </span>

      <span className="font-bold text-white">
        {value}
      </span>
    </div>
  );
}