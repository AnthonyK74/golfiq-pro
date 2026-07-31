import { calculateCourseFit } from "../utils/courseFit";

export default function PredictionFavourite({
  players = [],
  courseDNA = null,
}) {
  if (!players.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold text-green-400">
          Prediction Favourite
        </h2>

        <p className="text-slate-400">
          No player data available.
        </p>
      </div>
    );
  }

  const favourite = players
    .map((player) => {
      const fit = calculateCourseFit(player, courseDNA);

      const prediction =
        (player.golfIQ?.rating ?? 0) * 0.6 +
        (fit?.score ?? 0) * 0.4;

      return {
        ...player,
        prediction,
        fit,
      };
    })
    .sort((a, b) => b.prediction - a.prediction)[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-green-400">
        🏆 Prediction Favourite
      </h2>

      <h3 className="text-3xl font-bold text-white">
        {favourite.player.display_name}
      </h3>

      <div className="mt-6 space-y-3">

        <StatRow
          label="Prediction Rating"
          value={favourite.prediction.toFixed(1)}
        />

        <StatRow
          label="GolfIQ Rating"
          value={favourite.golfIQ.rating.toFixed(1)}
        />

        <StatRow
          label="Course Fit"
          value={favourite.fit.score}
        />

        <StatRow
          label="Confidence"
          value={`${favourite.confidence}%`}
        />

        <StatRow
          label="Trend"
          value={favourite.trend}
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