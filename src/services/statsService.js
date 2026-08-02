import { getDatabase } from "./databaseService";
import { calculateCourseFit } from "../utils/courseFit";
import {
  getCompletedTournaments,
  getTournamentStats,
  getTournamentResults,
} from "./golfApi";

import {
  hasCache,
  getCache,
  setCache,
  hasPlayersCache,
  getPlayersCache,
  setPlayersCache,
  clearCache,
} from "./cacheService";

import { calculatePlayerAnalytics } from "../utils/playerAnalytics";
import { calculateGolfIQRating } from "./golfiqRating";

async function loadPlayerStats() {
  if (hasCache()) {
    return getCache();
  }

  const tournamentsResponse = await getCompletedTournaments();
  const tournaments = (tournamentsResponse.data ?? []).slice(0, 5);

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

async function loadTournamentResults() {
  const tournamentsResponse =
    await getCompletedTournaments();

  const tournaments = (tournamentsResponse.data ?? []).slice(0, 5);

  const allResults = [];

  for (const tournament of tournaments) {
    let page = 1;

    while (true) {
      try {
        const response =
          await getTournamentResults(
            tournament.id,
            page
          );

        const results =
          response.data ?? [];

        if (!results.length) break;

        allResults.push(...results);

        const nextPage =
          response.meta?.next_page;

        if (!nextPage) break;

        page = nextPage;
      } catch {
        break;
      }
    }
  }

  return allResults;
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
  const tournaments = new Map();

  for (const round of playerRounds) {
    const id = round.tournament?.id;

    if (!id) continue;

    if (!tournaments.has(id)) {
      tournaments.set(id, {
        date: round.tournament?.start_date,
        rounds: [],
      });
    }

    tournaments.get(id).rounds.push(round);
  }

  return [...tournaments.values()]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 5)
    .flatMap((t) => t.rounds);
}

function getTourModeRounds(
  playerRounds,
  latestTournamentIds
) {
  return playerRounds.filter((round) =>
    latestTournamentIds.includes(
      round.tournament?.id
    )
  );
}

/* --------------------------------------------------
   GolfIQ V3
--------------------------------------------------- */

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function buildGolfIQ(players) {
  // -------------------------
  // Build one raw score
  // -------------------------

  players.forEach((player) => {
    const golfIQ = player.golfIQ.rating;
    const cgi = player.golfIQ.cgi;

    const sgTotal =
      player.averages.sg_total ?? 0;

    const courseFit =
      player.courseFit?.score ?? 75;

    const confidence =
      player.confidence ?? 70;

    // -------------------------
// Five GolfIQ Pillars
// -------------------------

const ballStriking =
  golfIQ * 0.60 +
  courseFit * 0.40;

const scoring =
  cgi * 4 +
  sgTotal * 6;

const course =
  courseFit;

const consistency =
  player.consistency ?? 70;

const form =
  confidence;

player.golfIQ.rawScore =
  ballStriking * 0.40 +
  scoring * 0.25 +
  course * 0.15 +
  consistency * 0.10 +
  form * 0.10;
  });

  // -------------------------
  // Normalise final score
  // -------------------------

  const scores = players.map(
    (p) => p.golfIQ.rawScore
  );

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = Math.max(max - min, 1);

  players.forEach((player) => {
    const score =
      (player.golfIQ.rawScore - min) /
      range;

    player.golfIQ.rating = Number(
      (60 + score * 40).toFixed(1)
    );
  });

  // -------------------------
  // Sort
  // -------------------------

  players.sort(
    (a, b) =>
      b.golfIQ.rating -
      a.golfIQ.rating
  );

  // -------------------------
  // Grades
  // -------------------------

  players.forEach((player, index) => {
    let grade = "B";

    if (index === 0)
      grade = "S";
    else if (index < 5)
      grade = "A+";
    else if (index < 10)
      grade = "A";
    else if (index < 20)
      grade = "A-";
    else if (index < 40)
      grade = "B+";

    player.golfIQ.grade = grade;
  });

  return players;
}


async function loadAnalysedPlayers(mode = "starts") {
  const [allRounds, allResults] = await Promise.all([
  loadPlayerStats(),
  loadTournamentResults(),
]);

  const grouped = groupRoundsByPlayer(allRounds);

  const resultsByPlayer = new Map();

  for (const result of allResults) {
    const id = String(result.player.id);

    if (!resultsByPlayer.has(id)) {
      resultsByPlayer.set(id, []);
    }

    resultsByPlayer.get(id).push(result);
  }

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
        ? getTourModeRounds(
            rounds,
            latestTournamentIds
          )
        : getLastFiveStarts(rounds);

    if (selectedRounds.length < 3) continue;

    const analytics =
      calculatePlayerAnalytics(selectedRounds);

    if (!analytics) continue;

    const tournamentCount = new Set(
      selectedRounds.map(
        (r) => r.tournament?.id
      )
    ).size;

    analytics.events = tournamentCount;
    analytics.rounds = selectedRounds.length;

    const golfIQ = calculateGolfIQRating(analytics);
const courseFit = calculateCourseFit(analytics);

    const metrics = golfIQ.metrics;

    const metricList = [
      ["Off the Tee", metrics.offTee],
      ["Approach", metrics.approach],
      ["Around the Green", metrics.aroundGreen],
      ["Putting", metrics.putting],
      ["Ball Striking", metrics.ballStriking],
      ["Short Game", metrics.shortGame],
    ];

    const sortedMetrics = [...metricList].sort(
      (a, b) => b[1] - a[1]
    );

    const strengths = sortedMetrics
      .slice(0, 3)
      .map(([name]) => name);

    const weaknesses = sortedMetrics
      .slice(-2)
      .map(([name]) => name);

    let archetype = "Balanced Player";

    if (metrics.offTee >= 85)
      archetype = "🚀 Power Driver";
    else if (metrics.approach >= 85)
      archetype = "🎯 Iron Specialist";
    else if (metrics.shortGame >= 85)
      archetype = "🧙 Short Game Wizard";
    else if (metrics.putting >= 85)
      archetype = "🎱 Putting Specialist";

    const playerResults =
      resultsByPlayer.get(
        String(analytics.player.id)
      ) ?? [];

    players.push({
  ...analytics,

  rounds: selectedRounds,

  starts: tournamentCount,

  results: playerResults,

  courseFit,

  golfIQ: {
    ...golfIQ,

    strengths,
    weaknesses,
    archetype,
  },
});
}

  // NEW: Build GolfIQ V3 after all players exist
  const rankedPlayers = buildGolfIQ(players);

return rankedPlayers;
}

export async function getAllPlayers(
  mode = "starts"
) {
  const database = getDatabase();

  if (database.length > 0) {
    console.log("✅ Loaded players from database");
    return database;
  }

  if (hasPlayersCache()) {
    return getPlayersCache();
  }

 const players = await loadAnalysedPlayers(mode);

  setPlayersCache(players);

  return players;
}



export async function getLeaderboard(
  statField = "golfiq",
  mode = "starts"
) {
  const players =
  await getAllPlayers(mode);

  if (statField !== "golfiq") {
    players.sort((a, b) => {
      if (statField === "cgi") {
        return (
          b.averages.cgi -
          a.averages.cgi
        );
      }

      return (
        (b.averages?.[statField] ?? 0) -
        (a.averages?.[statField] ?? 0)
      );
    });
  }

  return players.slice(0, 20);
}

export async function getPlayer(
  id,
  mode = "starts"
) {
  const players =
    await loadAnalysedPlayers(mode);

  return (
    players.find(
      (p) =>
        String(p.player.id) ===
        String(id)
    ) ?? null
  );
}

export async function searchPlayers(
  search,
  mode = "starts"
) {
  const players =
    await loadAnalysedPlayers(mode);

  if (!search) return players;

  const term =
    search.toLowerCase();

  return players.filter((p) => {
    const fullName =
      `${p.player.first_name} ${p.player.last_name}`.toLowerCase();

    return fullName.includes(term);
  });
}

export function refreshStatistics() {
  clearCache();
}