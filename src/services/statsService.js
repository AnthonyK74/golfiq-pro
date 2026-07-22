import {
  getCompletedTournaments,
  getTournamentStats,
} from "./golfApi";

import {
  hasCache,
  getCache,
  setCache,
  clearCache,
} from "./cacheService";

import { calculatePlayerAnalytics } from "../utils/playerAnalytics";

async function loadPlayerStats() {
  if (hasCache()) {
    return getCache();
  }

  const tournamentsResponse = await getCompletedTournaments();
  const tournaments = tournamentsResponse.data ?? [];

  const allRounds = [];

  for (const tournament of tournaments) {
    let page = 1;

    while (true) {
      try {
        const response = await getTournamentStats(
          tournament.id,
          page
        );

        const rounds = response.data ?? [];

        if (!rounds.length) break;

        allRounds.push(...rounds);

        const nextPage = response.meta?.next_page;

        if (!nextPage) break;

        page = nextPage;
      } catch {
        break;
      }
    }
  }

  setCache(allRounds);

  return allRounds;
}

function groupRoundsByPlayer(rounds) {
  const grouped = new Map();

  for (const round of rounds) {
    const id = String(round.player.id);

    if (!grouped.has(id)) {
      grouped.set(id, []);
    }

    grouped.get(id).push(round);
  }

  return grouped;
}

function getLastFiveStarts(playerRounds) {
  return [...playerRounds]
    .sort(
      (a, b) =>
        new Date(b.tournament?.start_date ?? 0) -
        new Date(a.tournament?.start_date ?? 0)
    )
    .slice(0, 5);
}

function getTourModeRounds(playerRounds, latestTournamentIds) {
  return playerRounds.filter((round) =>
    latestTournamentIds.includes(round.tournament?.id)
  );
}

async function loadAnalysedPlayers(mode = "starts") {
  const allRounds = await loadPlayerStats();

  const grouped = groupRoundsByPlayer(allRounds);

  const latestTournamentIds = [
    ...new Set(
      allRounds
        .map((r) => ({
          id: r.tournament?.id,
          date: r.tournament?.start_date,
        }))
        .sort(
          (a, b) =>
            new Date(b.date ?? 0) -
            new Date(a.date ?? 0)
        )
        .map((t) => t.id)
    ),
  ].slice(0, 5);

  const players = [];

  for (const rounds of grouped.values()) {
    const selectedRounds =
      mode === "tour"
        ? getTourModeRounds(rounds, latestTournamentIds)
        : getLastFiveStarts(rounds);

    if (!selectedRounds.length) continue;

    const analytics =
      calculatePlayerAnalytics(selectedRounds);

    if (analytics) {
      players.push(analytics);
    }
  }

  return players;
}

export async function getAllPlayers(mode = "starts") {
  return loadAnalysedPlayers(mode);
}

export async function getLeaderboard(
  statField = "cgi",
  mode = "starts"
) {
  const players = await loadAnalysedPlayers(mode);

  players.sort((a, b) => {
    if (statField === "cgi") {
      return b.averages.cgi - a.averages.cgi;
    }

    return (
      (b.averages?.[statField] ?? 0) -
      (a.averages?.[statField] ?? 0)
    );
  });

  return players.slice(0, 20);
}

export async function getPlayer(
  id,
  mode = "starts"
) {
  const players = await loadAnalysedPlayers(mode);

  return (
    players.find(
      (p) => String(p.player.id) === String(id)
    ) ?? null
  );
}

export function refreshStatistics() {
  clearCache();
}