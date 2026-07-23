import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import WorldRankings from "./pages/WorldRankings";
import PlayerSearch from "./pages/PlayerSearch";
import PlayerProfile from "./pages/PlayerProfile";
import ComparePlayers from "./pages/ComparePlayers";
import Schedule from "./pages/Schedule";
import Statistics from "./pages/Statistics";
import Predictions from "./pages/Predictions";
import CourseFit from "./pages/CourseFit";
import GoatRankings from "./pages/GoatRankings";
import TournamentPredictor from "./pages/TournamentPredictor";

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
              path="/statistics"
              element={<Statistics />}
            />

            <Route
              path="/world-rankings"
              element={<WorldRankings />}
            />

            <Route
              path="/player-search"
              element={<PlayerSearch />}
            />

            <Route
              path="/player/:id"
              element={<PlayerProfile />}
            />

            <Route
              path="/compare"
              element={<ComparePlayers />}
            />

            <Route
              path="/schedule"
              element={<Schedule />}
            />

            <Route
              path="/predictions"
              element={<Predictions />}
            />

            <Route
              path="/tournament-predictor"
              element={<TournamentPredictor />}
            />

            <Route
              path="/course-fit"
              element={<CourseFit />}
            />

            <Route
              path="/goat-rankings"
              element={<GoatRankings />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}