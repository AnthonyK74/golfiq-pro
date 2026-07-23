import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlayerIntelligence } from "../services/playerService";

export default function PlayerIntelligence() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayer() {
      try {
        const data = await getPlayerIntelligence(id);
        setPlayer(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400">
        Loading Player Intelligence...
      </div>
    );
  }

  if (!player) {
    return (
      <div className="p-10 text-center text-red-400">
        Player not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-4xl font-bold text-green-400">
        🧠 {player.player.display_name}
      </h1>

      <p className="mb-8 text-slate-400">
        Player Intelligence Report
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-lg bg-slate-800 p-4">
          <h3 className="text-sm text-slate-400">GolfIQ</h3>
          <p className="mt-2 text-3xl font-bold text-green-400">
            {player.averageGolfIQ.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-4">
          <h3 className="text-sm text-slate-400">Events Analysed</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            {player.tournaments}
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-4">
          <h3 className="text-sm text-slate-400">Driving Accuracy</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            {player.drivingAccuracy.toFixed(1)}%
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-4">
          <h3 className="text-sm text-slate-400">Greens in Regulation</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            {player.greensInRegulation.toFixed(1)}%
          </p>
        </div>

      </div>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">

        <h2 className="mb-6 text-2xl font-bold text-green-400">
          Strokes Gained
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-lg bg-slate-800 p-4">
            <div className="text-slate-400">Off The Tee</div>
            <div className="mt-2 text-2xl font-bold text-white">
              {player.strokesGained.ott.toFixed(2)}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800 p-4">
            <div className="text-slate-400">Approach</div>
            <div className="mt-2 text-2xl font-bold text-white">
              {player.strokesGained.app.toFixed(2)}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800 p-4">
            <div className="text-slate-400">Around Green</div>
            <div className="mt-2 text-2xl font-bold text-white">
              {player.strokesGained.arg.toFixed(2)}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800 p-4">
            <div className="text-slate-400">Putting</div>
            <div className="mt-2 text-2xl font-bold text-white">
              {player.strokesGained.putt.toFixed(2)}
            </div>
          </div>

          <div className="rounded-lg bg-slate-800 p-4">
            <div className="text-slate-400">SG Total</div>
            <div className="mt-2 text-2xl font-bold text-green-400">
              {player.strokesGained.total.toFixed(2)}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}