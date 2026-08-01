import { useNavigate } from "react-router-dom";

export default function GoatRankings() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl">

      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Dashboard
      </button>

      <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
        GOAT RANKINGS
      </p>

      <h1 className="mt-2 text-5xl font-extrabold text-white">
        Greatest of All Time
      </h1>

      <p className="mt-4 mb-8 text-xl text-slate-300">
        Explore GolfIQ's all-time rankings of the greatest golfers in PGA Tour history.
      </p>

      <div className="mb-10 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <span className="font-bold">
          About GOAT Rankings:
        </span>{" "}
        This page will rank the greatest players in golf history using career achievements, major championships, victories, longevity and GolfIQ historical analysis.
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

        <div className="text-7xl">
          🏆
        </div>

        <h2 className="mt-6 text-3xl font-bold text-white">
          Coming Soon
        </h2>

        <p className="mt-4 text-lg text-slate-400">
          The GolfIQ GOAT Engine is currently under development and will provide a data-driven ranking of the greatest golfers of all time.
        </p>

      </div>

    </div>
  );
}