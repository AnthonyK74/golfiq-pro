let playerStatsCache = null;

export function hasCache() {
  return playerStatsCache !== null;
}

export function getCache() {
  return playerStatsCache;
}

export function setCache(data) {
  playerStatsCache = data;
}

export function clearCache() {
  playerStatsCache = null;
}