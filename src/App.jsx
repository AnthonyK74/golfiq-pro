import { Routes, Route, useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import WorldRankings from "./pages/WorldRankings";
import PlayerSearch from "./pages/PlayerSearch";
import Schedule from "./pages/Schedule";
import Statistics from "./pages/Statistics";
import GoatRankings from "./pages/GoatRankings";

function Predictions() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold text-green-400">
        🎯 GolfIQ Predictions
      </h1>

      <p className="mt-6 text-slate-400">
        Coming soon...
      </p>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/world-rankings"
              element={<WorldRankings />}
            />

            <Route
              path="/player-search"
              element={<PlayerSearch />}
            />

            <Route
              path="/schedule"
              element={<Schedule />}
            />

            <Route
              path="/statistics"
              element={<Statistics />}
            />

            <Route
              path="/goat-rankings"
              element={<GoatRankings />}
            />

            <Route
              path="/predictions"
              element={<Predictions />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}