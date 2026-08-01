let playerStatsCache = null;

export function hasCache() {
  return playerStatsCache !== null;
}

export function getCache() {
  console.log("✅ Using cached player statistics");
  return playerStatsCache;
}

export function setCache(data) {
  console.log("💾 Caching player statistics");
  playerStatsCache = data;
}

export function clearCache() {
  console.log("🗑 Cache cleared");
  playerStatsCache = null;
}