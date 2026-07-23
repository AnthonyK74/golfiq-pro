import {
  getCompletedTournaments,
  getUpcomingTournaments,
  getTournament,
  getTournamentStats,
} from "./golfApi";

/**
 * Latest completed tournaments
 */
export async function getLatestCompletedTournaments() {
  const response = await getCompletedTournaments();

  return response.data ?? response;
}

/**
 * Upcoming schedule
 */
export async function getUpcomingSchedule() {
  const response = await getUpcomingTournaments();

  return response.data ?? response;
}

/**
 * Tournament information
 */
export async function getTournamentDetails(id) {
  const response = await getTournament(id);

  if (Array.isArray(response?.data)) {
    return response.data[0];
  }

  return response.data ?? response;
}

/**
 * Tournament statistics
 */
export async function getTournamentStatistics(id) {
  const response = await getTournamentStats(id);

  return response.data ?? response;
}