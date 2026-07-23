import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGolfIQ } from "../context/GolfIQContext";
import PlayerTrendChart from "../components/PlayerTrendChart";
import { calculateCourseFit } from "../utils/courseFit";

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { players, loading } = useGolfIQ();

  const player = useMemo(
    () =>
      players.find(
        (p) => String(p.player.id) === String(id)
      ),
    [players, id]
  );

  if (loading) {
    return (
      <div className="p-10 text-xl text-slate-400">
        Loading player...
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-10">
        <button
          onClick={() => navigate("/statistics")}
          className="mb-6 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-red-400">
          Player not found
        </h1>
      </div>
    );
  }

  const a = player.averages;
  const golfIQ = player.golfIQ;
  const courseFit = calculateCourseFit(player);

  return (
    <div className="space-y-8">

      <button
        onClick={() => navigate("/statistics")}
        className="rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Statistics
      </button>

      <div className="flex flex-col justify-between gap-6 lg:flex-row">

        <div>
          <h1 className="text-5xl font-bold text-green-400">
            {player.player.display_name}
          </h1>

          <p className="mt-2 text-xl text-slate-400">
            {player.player.country}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <Badge label={player.trend} />

            <Badge
              label={`Confidence ${player.confidence}%`}
            />

            <Badge
              label={`Consistency ${player.consistency}%`}
            />

          </div>

        </div>

        <div className="rounded-2xl border border-green-500 bg-slate-900 p-8 text-center w-full max-w-sm">

          <div className="text-slate-400">
            GolfIQ Rating
          </div>

          <div className="mt-2 text-7xl font-bold text-green-400">
            {golfIQ.rating.toFixed(1)}
          </div>

          <div className="mt-2 text-3xl font-bold text-yellow-400">
            {golfIQ.grade}
          </div>

          <div className="mt-6 border-t border-slate-700 pt-6">

            <div className="text-slate-400">
              Course Fit
            </div>

            <div className="mt-2 text-4xl font-bold text-cyan-400">
              {courseFit.score}
            </div>

            <div className="text-lg text-cyan-300">
              {courseFit.recommendation}
            </div>

          </div>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-6">

        <StatCard title="CGI" value={golfIQ.cgi} colour="text-green-400" />
        <StatCard title="SG OTT" value={a.sg_off_tee} colour="text-cyan-400" />
        <StatCard title="SG APP" value={a.sg_approach} colour="text-blue-400" />
        <StatCard title="SG ARG" value={a.sg_around_green} colour="text-orange-400" />
        <StatCard title="SG PUTT" value={a.sg_putting} colour="text-pink-400" />
        <StatCard title="SG TOTAL" value={a.sg_total} colour="text-yellow-400" />

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <Panel title="Driving">

          <StatRow label="Distance" value={`${a.driving_distance.toFixed(1)} yds`} />
          <StatRow label="Accuracy" value={`${a.driving_accuracy.toFixed(1)}%`} />
          <StatRow label="Off The Tee" value={a.sg_off_tee} />

        </Panel>

        <Panel title="Approach">

          <StatRow label="Approach" value={a.sg_approach} />
          <StatRow label="Greens in Regulation" value={`${a.greens_in_regulation.toFixed(1)}%`} />
          <StatRow label="Birdies" value={a.birdies.toFixed(1)} />

        </Panel>

        <Panel title="Short Game">

          <StatRow label="Around Green" value={a.sg_around_green} />
          <StatRow label="Scrambling" value={`${a.scrambling.toFixed(1)}%`} />
          <StatRow label="Putting" value={a.sg_putting} />

        </Panel>

        <Panel title="GolfIQ">

          <StatRow label="Rating" value={golfIQ.rating.toFixed(1)} />
          <StatRow label="Grade" value={golfIQ.grade} />
          <StatRow label="Confidence" value={`${player.confidence}%`} />
          <StatRow label="Consistency" value={`${player.consistency}%`} />

        </Panel>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <PlayerTrendChart
          rounds={player.history}
          title="SG Off The Tee"
          dataKey="sg_off_tee"
        />

        <PlayerTrendChart
          rounds={player.history}
          title="SG Approach"
          dataKey="sg_approach"
        />

        <PlayerTrendChart
          rounds={player.history}
          title="SG Around Green"
          dataKey="sg_around_green"
        />

        <PlayerTrendChart
          rounds={player.history}
          title="SG Putting"
          dataKey="sg_putting"
        />

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="mb-6 text-2xl font-bold text-green-400">
          Last Five Starts
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700">

              <th className="py-3 text-left">Tournament</th>
              <th>SG</th>
              <th>OTT</th>
              <th>APP</th>
              <th>ARG</th>
              <th>PUTT</th>

            </tr>

          </thead>

          <tbody>

            {player.history.map((round, index) => (

              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-800"
              >

                <td className="py-3">
                  {round.tournament?.name}
                </td>

                <td>{Number(round.sg_total ?? 0).toFixed(2)}</td>
                <td>{Number(round.sg_off_tee ?? 0).toFixed(2)}</td>
                <td>{Number(round.sg_approach ?? 0).toFixed(2)}</td>
                <td>{Number(round.sg_around_green ?? 0).toFixed(2)}</td>
                <td>{Number(round.sg_putting ?? 0).toFixed(2)}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-5 text-2xl font-bold text-green-400">
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatCard({ title, value, colour }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
      <div className="text-sm text-slate-400">
        {title}
      </div>
      <div className={`mt-2 text-3xl font-bold ${colour}`}>
        {typeof value === "number"
          ? value.toFixed(2)
          : value}
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-800 py-3">
      <span>{label}</span>
      <span className="font-bold text-white">
        {value}
      </span>
    </div>
  );
}

function Badge({ label }) {
  return (
    <span className="rounded-full bg-slate-800 px-4 py-2 text-sm">
      {label}
    </span>
  );
}