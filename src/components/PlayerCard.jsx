import { useNavigate } from "react-router-dom";

export default function PlayerCard({ player }) {
  const navigate = useNavigate();

  if (!player) return null;

  const averages = player.averages;
  const golfIQ = player.golfIQ;
  const prediction = player.prediction;

  const trendColour =
    player.trend === "🔥 Hot"
      ? "text-green-400"
      : player.trend === "📈 Improving"
      ? "text-cyan-400"
      : player.trend === "📉 Cooling"
      ? "text-orange-400"
      : "text-slate-300";

  return (
    <div
      onClick={() => navigate(`/player/${player.player.id}`)}
      className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:shadow-xl hover:shadow-green-900/30"
    >
      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            {player.player.display_name}
          </h2>

          <p className="mt-1 text-slate-400">
            {player.player.country}
          </p>

        </div>

        <div className="text-right">

          <div className="text-4xl font-bold text-green-400">
            {golfIQ.rating.toFixed(1)}
          </div>

          <div className="text-xs text-slate-400">
            {golfIQ.grade}
          </div>

        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <CardStat
          title="CGI"
          value={golfIQ.cgi.toFixed(2)}
          colour="text-green-400"
        />

        <CardStat
          title="SG Total"
          value={averages.sg_total.toFixed(2)}
          colour="text-cyan-400"
        />

        <CardStat
          title="Trend"
          value={player.trend}
          colour={trendColour}
        />

        <CardStat
          title="Confidence"
          value={`${player.confidence}%`}
          colour="text-yellow-400"
        />

        <CardStat
          title="Consistency"
          value={`${player.consistency}%`}
          colour="text-purple-400"
        />

        <CardStat
          title="Win %"
          value={
            prediction
              ? `${prediction.win.toFixed(1)}%`
              : "--"
          }
          colour="text-pink-400"
        />

      </div>

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="mb-2 flex justify-between text-sm">

          <span className="text-slate-400">
            SG Off The Tee
          </span>

          <span className="font-bold">
            {averages.sg_off_tee.toFixed(2)}
          </span>

        </div>

        <div className="mb-2 flex justify-between text-sm">

          <span className="text-slate-400">
            SG Approach
          </span>

          <span className="font-bold">
            {averages.sg_approach.toFixed(2)}
          </span>

        </div>

        <div className="mb-2 flex justify-between text-sm">

          <span className="text-slate-400">
            SG Around Green
          </span>

          <span className="font-bold">
            {averages.sg_around_green.toFixed(2)}
          </span>

        </div>

        <div className="flex justify-between text-sm">

          <span className="text-slate-400">
            SG Putting
          </span>

          <span className="font-bold">
            {averages.sg_putting.toFixed(2)}
          </span>

        </div>

      </div>

      <button className="mt-6 w-full rounded-xl bg-green-500 py-3 font-bold text-slate-900 transition hover:bg-green-400">
        View Player Profile
      </button>

    </div>
  );
}

function CardStat({ title, value, colour }) {
  return (
    <div className="rounded-xl bg-slate-800 p-3 text-center">

      <div className="text-xs text-slate-400">
        {title}
      </div>

      <div className={`mt-1 text-xl font-bold ${colour}`}>
        {value}
      </div>

    </div>
  );
}