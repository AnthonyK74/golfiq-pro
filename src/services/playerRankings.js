import { calculateGolfIQRating } from "./golfiqRating";

function sortDescending(players, selector) {
  return [...players].sort((a, b) => {
    const aValue = selector(a) ?? 0;
    const bValue = selector(b) ?? 0;
    return bValue - aValue;
  });
}

export function getGolfIQRankings(players) {
  return sortDescending(
    players,
    (player) => calculateGolfIQRating(player).rating
  );
}

export function getTopCGI(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.cgi
  ).slice(0, limit);
}

export function getTopSGTotal(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.sg_total
  ).slice(0, limit);
}

export function getTopOffTheTee(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.sg_off_tee
  ).slice(0, limit);
}

export function getTopApproach(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.sg_approach
  ).slice(0, limit);
}

export function getTopAroundGreen(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.sg_around_green
  ).slice(0, limit);
}

export function getTopPutting(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.sg_putting
  ).slice(0, limit);
}

export function getLongestDrivers(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.driving_distance
  ).slice(0, limit);
}

export function getMostAccurateDrivers(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.driving_accuracy
  ).slice(0, limit);
}

export function getBestScrambling(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.scrambling
  ).slice(0, limit);
}

export function getBestGIR(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.greens_in_regulation
  ).slice(0, limit);
}

export function getBestBirdieAverage(players, limit = 20) {
  return sortDescending(
    players,
    (player) => player.averages?.birdies
  ).slice(0, limit);
}

export function getPowerRankings(players, limit = 20) {
  return getGolfIQRankings(players).slice(0, limit);
}