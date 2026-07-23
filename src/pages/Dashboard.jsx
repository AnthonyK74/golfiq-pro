import { useEffect } from "react";
import { getLastFiveTournamentStats } from "../services/golfApi";
import { Link } from "react-router-dom";
import { useGolfIQ } from "../context/GolfIQContext";
import PlayerCard from "../components/PlayerCard";

export default function Dashboard() {
  const {
    leaderboard,
    hottestPlayers,
    lastUpdated,
    loading,
  } = useGolfIQ();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          <h2 className="text-2xl font-bold text-green-400">
            Loading GolfIQ...
          </h2>
        </div>
      </div>
    );
  }

  const leader = leaderboard[0];

  return (
    <div className="space-y-10">

      <div className="rounded-3xl border border-green-500 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-10">

        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">

          <div>

            <p className="font-semibold uppercase tracking-widest text-green-400">
              Professional PGA Analytics
            </p>

            <h1 className="mt-2 text-5xl font-extrabold">
              GolfIQ Pro
            </h1>

            <p className="mt-5 max-w-3xl text-lg text-slate-300">
              Live strokes gained analytics, GolfIQ ratings,
              course fit, trends and tournament predictions.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 w-full max-w-sm">

            <div className="flex justify-between">

              <span className="text-slate-400">
                Status
              </span>

              <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-slate-900">
                LIVE
              </span>

            </div>

            <div className="mt-6">

              <div className="text-sm text-slate-400">
                Last Updated
              </div>

              <div className="font-semibold">
                {lastUpdated
                  ? lastUpdated.toLocaleString("en-GB")
                  : "--"}
              </div>

            </div>

            <div className="mt-6">

              <div className="text-sm text-slate-400">
                Players Loaded
              </div>

              <div className="text-4xl font-bold text-green-400">
                {leaderboard.length}
              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">

        <SummaryCard
          title="GolfIQ #1"
          value={leader?.player.display_name ?? "--"}
          colour="text-green-400"
        />

        <SummaryCard
          title="Rating"
          value={leader?.golfIQ?.rating?.toFixed(1) ?? "--"}
          colour="text-cyan-400"
        />

        <SummaryCard
          title="CGI"
          value={leader?.golfIQ?.cgi?.toFixed(2) ?? "--"}
          colour="text-yellow-400"
        />

        <SummaryCard
          title="Trend"
          value={leader?.trend ?? "--"}
          colour="text-orange-400"
        />

        <SummaryCard
          title="Confidence"
          value={
            leader
              ? `${leader.confidence}%`
              : "--"
          }
          colour="text-pink-400"
        />

        <SummaryCard
          title="Course Fit"
          value={
            leader?.prediction?.courseFit?.score ??
            "--"
          }
          colour="text-purple-400"
        />

      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <div className="flex items-center justify-between">

          <div>

            <div className="text-green-400 uppercase tracking-widest text-sm">
              Featured Player
            </div>

            <h2 className="mt-2 text-4xl font-bold">
              {leader?.player.display_name}
            </h2>

          </div>

          <Link
            to={`/player/${leader?.player.id}`}
            className="rounded-xl bg-green-500 px-8 py-4 font-bold text-slate-900"
          >
            View Profile
          </Link>

        </div>

      </div>

      <div>

        <h2 className="mb-6 text-3xl font-bold text-green-400">
          Quick Actions
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <QuickLink
            icon="🏆"
            title="Tournament Predictor"
            subtitle="Winner predictions"
            to="/tournament-predictor"
          />

          <QuickLink
            icon="📊"
            title="Statistics"
            subtitle="Player analytics"
            to="/statistics"
          />

          <QuickLink
            icon="👥"
            title="Compare Players"
            subtitle="Head-to-head"
            to="/compare"
          />

          <QuickLink
            icon="⛳"
            title="Course Fit"
            subtitle="Course suitability"
            to="/course-fit"
          />

        </div>

      </div>

      <div>

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-bold text-green-400">
            Top GolfIQ Players
          </h2>

          <Link
            to="/statistics"
            className="rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900"
          >
            View All
          </Link>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {leaderboard.slice(0, 6).map((player) => (
            <PlayerCard
              key={player.player.id}
              player={player}
            />
          ))}

        </div>

      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="mb-6 text-3xl font-bold text-red-400">
          🔥 Hot Players
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {hottestPlayers.slice(0, 3).map((player) => (
            <PlayerCard
              key={player.player.id}
              player={player}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

function SummaryCard({ title, value, colour }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="text-sm uppercase text-slate-400">
        {title}
      </div>

      <div className={`mt-3 text-2xl font-bold ${colour}`}>
        {value}
      </div>
    </div>
  );
}

function QuickLink({ icon, title, subtitle, to }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-green-400"
    >
      <div className="text-5xl">
        {icon}
      </div>

      <div className="mt-5 text-2xl font-bold">
        {title}
      </div>

      <div className="mt-2 text-slate-400">
        {subtitle}
      </div>
    </Link>
  );
}