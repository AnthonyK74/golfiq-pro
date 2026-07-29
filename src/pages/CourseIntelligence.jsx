import { useEffect, useState } from "react";
import { getAllCompletedTournaments } from "../services/golfApi";

export default function CourseIntelligence() {
  const [season, setSeason] = useState(2026);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const response = await getAllCompletedTournaments(season);
        setTournaments(response.data ?? response);

        console.log(response.data ?? response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [season]);

  useEffect(() => {
    function handleScroll() {
      setShowTopButton(window.scrollY > 300);
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        🧠 Course Intelligence
      </h1>

      <div className="mb-6 flex items-center gap-3">
        <label className="font-semibold">
          Season:
        </label>

        <select
          value={season}
          onChange={(e) => setSeason(Number(e.target.value))}
          className="bg-slate-800 border border-slate-600 rounded px-3 py-2"
        >
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
        </select>
      </div>

      {loading ? (
        <p className="text-green-400">Loading tournaments...</p>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-4">
            Completed Tournaments ({tournaments.length})
          </h2>

          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="border border-slate-700 rounded-lg p-4 hover:border-green-500 hover:bg-slate-900 transition cursor-pointer"
              >
                <h3 className="text-xl font-bold text-green-400">
                  {tournament.name}
                </h3>

                <p>
                  <strong>Course:</strong>{" "}
                  {tournament.course_name || "Unknown"}
                </p>

                <p>
                  <strong>Season:</strong>{" "}
                  {tournament.season}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-black font-bold px-4 py-3 rounded-full shadow-lg"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}