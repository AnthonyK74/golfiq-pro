import { useNavigate } from "react-router-dom";

export default function Schedule() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 shadow-lg hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="mb-6 text-4xl font-bold text-green-400">
        📅 Tournament Schedule
      </h1>

      <p className="text-slate-300">
        View the latest PGA Tour schedule.
      </p>

      <p className="mt-4 text-slate-500">
        Coming soon...
      </p>
    </div>
  );
}