import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGolfIQ } from "../context/GolfIQContext";
import PlayerTrendChart from "../components/PlayerTrendChart";

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { players, loading } = useGolfIQ();

  const player = useMemo(() => {
    return players.find(
      (p) => String(p.player.id) === String(id)
    );
  }, [players, id]);

  if (loading) {
    return (
      <div className="p-10 text-xl text-slate-400">
        Loading Player...
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-10">
        <button
          onClick={() => navigate("/statistics")}
          className="mb-6 rounded bg-green-500 px-5 py-2 font-bold text-slate-900"
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

  let cgiColour = "text-red-400";

  if (a.cgi >= 4) cgiColour = "text-green-400";
  else if (a.cgi >= 2) cgiColour = "text-yellow-400";

  return (
    <div className="space-y-8">

      <button
        onClick={() => navigate("/statistics")}
        className="rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Statistics
      </button>

      <div>

        <h1 className="text-5xl font-bold text-green-400">
          {player.player.display_name}
        </h1>

        <p className="mt-2 text-xl text-slate-400">
          {player.player.country}
        </p>

        <p className="mt-2 text-green-300">
          Based on last {a.tournaments} tournaments
        </p>

      </div>

      <div className="rounded-xl border border-green-500 bg-slate-900 p-8 text-center">

        <p className="text-lg text-slate-400">
          GolfIQ Combined Golf Index
        </p>

        <h2 className={`mt-3 text-7xl font-bold ${cgiColour}`}>
          {a.cgi.toFixed(2)}
        </h2>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

          <h2 className="mb-5 text-2xl font-bold">
            ⛳ Average Strokes Gained
          </h2>

          <div className="space-y-3">

            <p>Off the Tee <strong>{a.sg_off_tee.toFixed(3)}</strong></p>
            <p>Approach <strong>{a.sg_approach.toFixed(3)}</strong></p>
            <p>Around Green <strong>{a.sg_around_green.toFixed(3)}</strong></p>
            <p>Putting <strong>{a.sg_putting.toFixed(3)}</strong></p>

            <hr className="border-slate-700"/>

            <p className="text-xl text-green-400">
              Total SG <strong>{a.sg_total.toFixed(3)}</strong>
            </p>

          </div>

        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

          <h2 className="mb-5 text-2xl font-bold">
            📊 Average Performance
          </h2>

          <div className="space-y-3">

            <p>Driving Distance <strong>{a.driving_distance.toFixed(1)}</strong></p>
            <p>Driving Accuracy <strong>{a.driving_accuracy.toFixed(1)}%</strong></p>
            <p>Greens in Regulation <strong>{a.greens_in_regulation.toFixed(1)}%</strong></p>
            <p>Scrambling <strong>{a.scrambling.toFixed(1)}%</strong></p>
            <p>Birdies <strong>{a.birdies.toFixed(1)}</strong></p>
            <p>Eagles <strong>{a.eagles.toFixed(1)}</strong></p>

          </div>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <PlayerTrendChart
          rounds={player.history}
          title="SG Off The Tee Trend"
          dataKey="sg_off_tee"
        />

        <PlayerTrendChart
          rounds={player.history}
          title="SG Approach Trend"
          dataKey="sg_approach"
        />

        <PlayerTrendChart
          rounds={player.history}
          title="SG Around Green Trend"
          dataKey="sg_around_green"
        />

        <PlayerTrendChart
          rounds={player.history}
          title="SG Putting Trend"
          dataKey="sg_putting"
        />

      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

        <h2 className="mb-6 text-2xl font-bold text-green-400">
          Last 5 Tournament Results
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700 text-left">
              <th className="pb-3">Tournament</th>
              <th>SG</th>
              <th>OTT</th>
              <th>APP</th>
              <th>PUTT</th>
            </tr>

          </thead>

          <tbody>

            {player.history.map((event, index) => (

              <tr
                key={index}
                className="border-b border-slate-800"
              >

                <td className="py-3">
                  {event.tournament?.name ?? "Tournament"}
                </td>

                <td>{event.sg_total?.toFixed(2)}</td>
                <td>{event.sg_off_tee?.toFixed(2)}</td>
                <td>{event.sg_approach?.toFixed(2)}</td>
                <td>{event.sg_putting?.toFixed(2)}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}