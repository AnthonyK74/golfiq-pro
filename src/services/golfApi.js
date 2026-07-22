console.log("ENV:", import.meta.env);
const API_KEY = import.meta.env.VITE_BALLDONTLIE_API_KEY;

const BASE_URL = "https://api.balldontlie.io";

async function request(endpoint) {
  console.log("Calling:", `${BASE_URL}${endpoint}`);
  console.log("Key loaded:", API_KEY ? "YES" : "NO");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: API_KEY,
      Accept: "application/json",
    },
  });

  console.log("Status:", response.status);

  const text = await response.text();
  console.log("Response:", text);

  if (!response.ok) {
    throw new Error(`API Error ${response.status}`);
  }

  return JSON.parse(text);
}

export async function getPlayers() {
  return request("/pga/v1/players?per_page=100");
}

export async function getCompletedTournaments() {
  return request("/pga/v2/tournaments?status=COMPLETED&per_page=5");
}

export async function getTournamentStats(tournamentId, page = 1) {
  return request(
    `/pga/v1/player_round_stats?tournament_ids[]=${tournamentId}&round_number=-1&per_page=100&page=${page}`
  );
}