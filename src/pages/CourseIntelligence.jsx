import { useEffect, useState } from "react";
import { getCompletedTournaments } from "../services/golfApi";
import StatBar from "../components/StatBar";

export default function CourseIntelligence() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await getCompletedTournaments();
        setTournaments(response.data ?? response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>🧠 Course Intelligence</h1>

      <h3>Recent Tournaments</h3>

      {tournaments.map((tournament) => (
        <div
          key={tournament.id}
          onClick={() => setSelectedTournament(tournament)}
          style={{
            cursor: "pointer",
            padding: 15,
            marginBottom: 15,
            border:
              selectedTournament?.id === tournament.id
                ? "2px solid #22c55e"
                : "1px solid #333",
            borderRadius: 10,
          }}
        >
          <h2>{tournament.name}</h2>

          <p>
            <strong>Course:</strong> {tournament.course_name}
          </p>

          <p>
            <strong>Season:</strong> {tournament.season}
          </p>

          <p>
            <strong>Winner:</strong>{" "}
            {tournament.champion?.display_name}
          </p>
        </div>
      ))}

      {selectedTournament && (
        <div
          style={{
            marginTop: 40,
            padding: 20,
            border: "1px solid #444",
            borderRadius: 10,
            background: "#111827",
          }}
        >
          <h2>{selectedTournament.name}</h2>

          <p>
            <strong>Course:</strong> {selectedTournament.course_name}
          </p>

          <p>
            <strong>Season:</strong> {selectedTournament.season}
          </p>

          <h3>🧠 Course Intelligence</h3>

          <p>Loading historical data...</p>
        </div>
      )}

      <h2 style={{ marginTop: 40 }}>Course DNA Preview</h2>

      <StatBar label="SG Approach" value={34} />
      <StatBar label="SG Off The Tee" value={24} />
      <StatBar label="Putting" value={16} />
      <StatBar label="Greens In Regulation" value={12} />
      <StatBar label="Scrambling" value={8} />
      <StatBar label="Driving Accuracy" value={6} />
    </div>
  );
}