import officialSchedule from "../data/officialSchedule.json";

export function getOfficialTournaments(season = null) {
  if (season) {
    return officialSchedule[season] ?? [];
  }

  return Object.values(officialSchedule)
    .flat()
    .sort(
  (a, b) =>
    new Date(a.start_date) -
    new Date(b.start_date)
);
}

export function getTournamentById(id) {
  return Object.values(officialSchedule)
    .flat()
    .find(
      (tournament) => tournament.id === id
    );
}

export function isOfficialTournament(id) {
  return !!getTournamentById(id);
}