const API_KEY = import.meta.env.VITE_BALLDONTLIE_API_KEY;

const BASE_URL = "https://api.balldontlie.io/pga/v2";

async function request(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Ball Don't Lie API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getTournaments(season) {
  return request(`/tournaments?season=${season}&per_page=100`);
}

export async function getTournament(id) {
  return request(`/tournaments/${id}`);
}

export async function getPlayers(page = 1) {
  return request(`/players?per_page=100&page=${page}`);
}

export async function getPlayer(id) {
  return request(`/players/${id}`);
}

export async function getSeasonStats(season) {
  return request(`/season_averages?season=${season}`);
}