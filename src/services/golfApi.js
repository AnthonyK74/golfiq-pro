console.log("ENV:", import.meta.env);

const API_KEY = import.meta.env.VITE_BALLDONTLIE_API_KEY;
const BASE_URL = "https://api.balldontlie.io";

// Cache for the last five tournament stats
let lastFiveStatsCache = null;
let lastFiveStatsPromise = null;

async function request(endpoint) {
  console.log("Calling:", `${BASE_URL}${endpoint}`);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: API_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error ${response.status}`);
  }

  return response.json();
}

// Players
export async function getPlayers() {
  return request("/pga/v1/players?per_page=100");
}

// ALL completed tournaments (cursor pagination)
export async function getCompletedTournaments() {
  const tournaments = [];

  let cursor = null;

  while (true) {
    const endpoint = cursor
      ? `/pga/v2/tournaments?status=COMPLETED&per_page=100&cursor=${cursor}`
      : `/pga/v2/tournaments?status=COMPLETED&per_page=100`;

    const response = await request(endpoint);

    console.log("Sample tournament:", response.data?.[0]);

    tournaments.push(...(response.data ?? []));

    if (!response.meta?.next_cursor) {
      break;
    }

    cursor = response.meta.next_cursor;
  }

  return {
    data: tournaments,
  };
}

export async function getAllCompletedTournaments(
  season = 2026
) {
  return request(
    `/pga/v2/tournaments?season=${season}&status=COMPLETED&per_page=100`
  );
}

// Tournament schedule
export async function getUpcomingTournaments() {
  return request(
    "/pga/v2/tournaments?season=2026&per_page=100"
  );
}

// Tournament statistics (cursor pagination)
export async function getTournamentStats(
  tournamentId
) {
  const allStats = [];

  let cursor = null;

 while (true) {
  const endpoint = cursor
    ? `/pga/v1/player_round_stats?tournament_ids[]=${tournamentId}&per_page=100&cursor=${cursor}`
    : `/pga/v1/player_round_stats?tournament_ids[]=${tournamentId}&per_page=100`;
    const response = await request(endpoint);

    const rows = response.data ?? [];

    if (rows.length) {
  console.log(
    `Tournament requested: ${tournamentId}`
  );

  console.table(
    rows.slice(0, 5).map((row) => ({
      apiTournamentId: row.tournament?.id,
apiTournamentName: row.tournament?.name,
season: row.tournament?.season,
startDate: row.tournament?.start_date,
endDate: row.tournament?.end_date,
      player: `${row.player.first_name} ${row.player.last_name}`,
      round: row.round_number,
    }))
  );
}

    allStats.push(...rows);

    if (!response.meta?.next_cursor) {
      break;
    }

    cursor = response.meta.next_cursor;
  }

  return {
    data: allStats,
  };
}

// Tournament Results (cursor pagination)
export async function getTournamentResults(
  tournamentId
) {
  const allResults = [];

  let cursor = null;

  while (true) {
    const endpoint = cursor
      ? `/pga/v1/tournament_results?tournament_ids[]=${tournamentId}&per_page=100&cursor=${cursor}`
      : `/pga/v1/tournament_results?tournament_ids[]=${tournamentId}&per_page=100`;

    const response = await request(endpoint);

    allResults.push(...(response.data ?? []));

    if (!response.meta?.next_cursor) {
      break;
    }

    cursor = response.meta.next_cursor;
  }

  return {
    data: allResults,
  };
}

// Single tournament
export async function getTournament(
  tournamentId
) {
  return request(
    `/pga/v2/tournaments?tournament_ids[]=${tournamentId}`
  );
}

// Last five tournament statistics (cached)
export async function getLastFiveTournamentStats(
  forceRefresh = false
) {
  if (!forceRefresh && lastFiveStatsCache) {
    return lastFiveStatsCache;
  }

  if (!forceRefresh && lastFiveStatsPromise) {
    return lastFiveStatsPromise;
  }

  lastFiveStatsPromise = (async () => {
    const tournaments =
      await getCompletedTournaments();

    const tournamentList =
      tournaments.data ?? tournaments;

    const allStats = [];

    for (const tournament of tournamentList.slice(0, 5)) {
      try {
        const stats =
          await getTournamentStats(
            tournament.id
          );

        const rows =
          stats.data ?? [];

        rows.forEach((row) => {
          allStats.push({
            ...row,
            tournamentName:
              tournament.name,
          });
        });
      } catch (err) {
        console.error(
          `Failed to load tournament ${tournament.id}`,
          err
        );
      }
    }

    lastFiveStatsCache = allStats;
    lastFiveStatsPromise = null;

    return allStats;
  })();

  return lastFiveStatsPromise;
}