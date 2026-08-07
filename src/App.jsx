import { Routes, Route } from "react-router-dom";
import CourseIntelligence from "./pages/CourseIntelligence";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PredictionValidation from "./pages/PredictionValidation";
import Dashboard from "./pages/Dashboard";
import WorldRankings from "./pages/WorldRankings";
import PlayerSearch from "./pages/PlayerSearch";
import PlayerProfile from "./pages/PlayerProfile";
import ComparePlayers from "./pages/ComparePlayers";
import Schedule from "./pages/Schedule";
import Statistics from "./pages/Statistics";
import Predictions from "./pages/Predictions";
import CourseFit from "./pages/CourseFit";
import CourseForm from "./pages/CourseForm";
import GoatRankings from "./pages/GoatRankings";
import TournamentPredictor from "./pages/TournamentPredictor";
import TournamentHub from "./pages/TournamentHub";
import Leaderboard from "./pages/Leaderboard";
import GolfIQPowerRankings from "./pages/GolfIQPowerRankings";
import BenchmarkValidation from "./pages/BenchmarkValidation";

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
  path="/course-intelligence"
  element={<CourseIntelligence />}
/>
            <Route
              path="/statistics"
              element={<Statistics />}
            />

            <Route
              path="/world-rankings"
              element={<WorldRankings />}
          />
<Route
  path="/benchmark-validation"
  element={<BenchmarkValidation />}
/>

<Route
  path="/golfiq-power-rankings"
  element={<GolfIQPowerRankings />}
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
              path="/tournament/:id"
              element={<TournamentHub />}
            />

            <Route
              path="/tournament/:id/leaderboard"
              element={<Leaderboard />}
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
  path="/course-form"
  element={<CourseForm />}
/>

            <Route
              path="/goat-rankings"
              element={<GoatRankings />}
            />
            <Route
  path="/prediction-validation"
  element={<PredictionValidation />}
/>
          </Routes>
        </main>
      </div>
    </div>
  );
}