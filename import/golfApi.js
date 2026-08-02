const API_KEY = process.env.VITE_BALLDONTLIE_API_KEY;

const V1 = "https://api.balldontlie.io/pga/v1";
const V2 = "https://api.balldontlie.io/pga/v2";

async function request(url) {
  const response = await fetch(url, {
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

export async function getPlayers(page = 1) {
  return request(`${V1}/players?page=${page}&per_page=100`);
}

export async function getTournaments(season) {
  return request(`${V2}/tournaments?season=${season}&per_page=100`);
}