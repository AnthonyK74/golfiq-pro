let roundsCache = null;
let playersCache = null;

const PLAYERS_KEY = "golfiq-players";

export function hasCache() {
  return roundsCache !== null;
}

export function getCache() {
  console.log("✅ Using cached rounds");
  return roundsCache;
}

export function setCache(data) {
  console.log("💾 Caching rounds");
  roundsCache = data;
}

export function hasPlayersCache() {
  if (playersCache) return true;

  return !!localStorage.getItem(PLAYERS_KEY);
}

export function getPlayersCache() {
  if (playersCache) return playersCache;

  const cached =
    localStorage.getItem(PLAYERS_KEY);

  if (!cached) return null;

  console.log("✅ Using cached players");

  playersCache = JSON.parse(cached);

  return playersCache;
}

export function setPlayersCache(players) {
  playersCache = players;

  localStorage.setItem(
    PLAYERS_KEY,
    JSON.stringify(players)
  );

  console.log("💾 Saved player database");
}

export function clearCache() {
  roundsCache = null;
  playersCache = null;

  localStorage.removeItem(PLAYERS_KEY);

  console.log("🗑 Cache cleared");
}