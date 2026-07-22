import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getAllPlayers } from "../services/statsService";

const GolfIQContext = createContext();

export function GolfIQProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW
  const [analysisMode, setAnalysisMode] = useState("starts");

  async function refresh(mode = analysisMode) {
    setLoading(true);

    const data = await getAllPlayers(mode);

    setPlayers(data);

    setLoading(false);
  }

  useEffect(() => {
    refresh(analysisMode);
  }, [analysisMode]);

  return (
    <GolfIQContext.Provider
      value={{
        players,
        loading,

        analysisMode,
        setAnalysisMode,

        refresh,
      }}
    >
      {children}
    </GolfIQContext.Provider>
  );
}

export function useGolfIQ() {
  return useContext(GolfIQContext);
}