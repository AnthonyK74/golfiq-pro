import { importHistory } from "../api/importer";
import { getAllPlayers } from "../services/statsService";

export default function DatabaseTools() {
  async function handleImport() {
    await importHistory();
    alert("Historical data imported.");
  }

  async function buildDatabase() {
    const players = await getAllPlayers("starts");

    const json = JSON.stringify(players, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "golfiq-database.json";
    a.click();

    URL.revokeObjectURL(url);

    alert(`Database created with ${players.length} players.`);
  }

  return (
    <div className="mx-auto max-w-3xl p-10">

      <h1 className="mb-8 text-4xl font-bold text-green-400">
        GolfIQ Database Tools
      </h1>

      <div className="space-y-4">

        <button
          onClick={handleImport}
          className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-500"
        >
          Import 2024–2026 History
        </button>

        <button
          onClick={buildDatabase}
          className="w-full rounded-xl bg-green-500 px-6 py-4 font-bold text-slate-900 hover:bg-green-400"
        >
          Build GolfIQ Database
        </button>

      </div>

    </div>
  );
}