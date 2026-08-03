const API_KEY = process.env.VITE_BALLDONTLIE_API_KEY;

const V1 = "https://api.balldontlie.io/pga/v1";
const V2 = "https://api.balldontlie.io/pga/v2";

async function request(url) {
  console.log("Calling:", url);

  const response = await fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  });

  if (!response.ok) {
    console.error(`FAILED: ${response.status} ${response.statusText}`);
    console.error("URL:", url);

    throw new Error(
      `Ball Don't Lie API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getPlayers(cursor = null) {
  let url = `${V1}/players?per_page=100`;

  if (cursor) {
    url += `&cursor=${cursor}`;
  }

  return request(url);
}

export async function getTournaments(season) {
  return request(`${V2}/tournaments?season=${season}&per_page=100`);
}

export async function getTournamentResults(
  tournamentId,
  page = 1
) {
  return request(
    `${V1}/tournament_results?tournament_ids[]=${tournamentId}&per_page=100&page=${page}`
  );
}

export async function getTournamentStats(
  tournamentId,
  page = 1
) {
  const url =
    `${V1}/player_round_stats?tournament_ids[]=${tournamentId}&round_number=-1&per_page=100&page=${page}`;

  console.log("\n=================================");
  console.log("REQUEST:", url);

  const data = await request(url);

  console.log("RESPONSE:");
  console.log(JSON.stringify(data, null, 2));

  return data;
}