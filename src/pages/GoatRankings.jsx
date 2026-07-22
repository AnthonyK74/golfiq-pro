export default function GoatRankings({ setPage }) {
  return (
    <div className="p-10">
      <button
        onClick={() => setPage("dashboard")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 shadow-lg hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="mb-6 text-4xl font-bold text-green-400">
        ⭐ GOAT Rankings
      </h1>

      <p className="text-slate-300">
        Greatest golfers of all time.
      </p>

      <p className="mt-4 text-slate-500">
        Coming soon...
      </p>
    </div>
  );
}