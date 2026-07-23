console.log("ENV:", import.meta.env);

const API_KEY = import.meta.env.VITE_BALLDONTLIE_API_KEY;

const BASE_URL = "https://api.balldontlie.io";

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

// Latest completed tournaments
export async function getCompletedTournaments() {
  return request("/pga/v2/tournaments?status=COMPLETED&per_page=5");
}

// Tournament schedule (all available tournaments)
export async function getUpcomingTournaments() {
  return request("/pga/v2/tournaments?per_page=20");
}

// Tournament statistics
export async function getTournamentStats(tournamentId, page = 1) {
  return request(
    `/pga/v1/player_round_stats?tournament_ids[]=${tournamentId}&round_number=-1&per_page=100&page=${page}`
  );
}

// Single tournament
export async function getTournament(tournamentId) {
  return request(`/pga/v2/tournaments?id=${tournamentId}`);
}
export async function getLastFiveTournamentStats() {
  // Get the latest completed tournaments
  const tournaments = await getCompletedTournaments();

  const tournamentList = tournaments.data ?? tournaments;

  const allStats = [];

  for (const tournament of tournamentList.slice(0, 5)) {
    try {
      const stats = await getTournamentStats(tournament.id);

      const rows = stats.data ?? stats;

      rows.forEach((row) => {
        allStats.push({
          ...row,
          tournamentName: tournament.name,
        });
      });
    } catch (err) {
      console.error(
        `Failed to load tournament ${tournament.id}`,
        err
      );
    }
  }

  return allStats;
}