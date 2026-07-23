import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import {
  getAllPlayers,
  refreshStatistics,
} from "../services/statsService";

const GolfIQContext = createContext(null);

export function GolfIQProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [analysisMode, setAnalysisMode] =
    useState("starts");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  const loadPlayers = useCallback(
    async (mode = analysisMode) => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllPlayers(mode);

        data.sort(
          (a, b) =>
            (b.golfIQ?.rating ?? 0) -
            (a.golfIQ?.rating ?? 0)
        );

        setPlayers(data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load GolfIQ statistics."
        );
      } finally {
        setLoading(false);
      }
    },
    [analysisMode]
  );

  const refresh = useCallback(async () => {
    refreshStatistics();
    await loadPlayers(analysisMode);
  }, [analysisMode, loadPlayers]);

  useEffect(() => {
    loadPlayers(analysisMode);
  }, [analysisMode, loadPlayers]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadPlayers(analysisMode);
    }, 300000);

    return () => clearInterval(interval);
  }, [analysisMode, loadPlayers]);

  const leaderboard = useMemo(
    () => players.slice(0, 20),
    [players]
  );

  const hottestPlayers = useMemo(
    () =>
      players.filter(
        (p) => p.trend === "🔥 Hot"
      ),
    [players]
  );

  const improvingPlayers = useMemo(
    () =>
      players.filter(
        (p) => p.trend === "📈 Improving"
      ),
    [players]
  );

  const value = {
    players,
    leaderboard,
    hottestPlayers,
    improvingPlayers,

    loading,
    error,
    lastUpdated,

    analysisMode,
    setAnalysisMode,

    refresh,
  };

  return (
    <GolfIQContext.Provider value={value}>
      {children}
    </GolfIQContext.Provider>
  );
}

export function useGolfIQ() {
  const context = useContext(GolfIQContext);

  if (!context) {
    throw new Error(
      "useGolfIQ must be used inside GolfIQProvider."
    );
  }

  return context;
}