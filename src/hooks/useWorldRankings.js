import { useEffect, useState } from "react";
import { getWorldRankings } from "../services/golfApi";

export default function useWorldRankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      const data = await getWorldRankings();
      setRankings(data);
      setLoading(false);
    }

    loadRankings();
  }, []);

  return {
    rankings,
    loading,
  };
}