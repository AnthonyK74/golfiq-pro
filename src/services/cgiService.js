/**
 * GolfIQ Combined Golf Index (CGI)
 *
 * Formula:
 *
 * CGI =
 * (1.5 × SG Approach)
 * + (1.2 × SG Off The Tee)
 * + (1.0 × SG Putting)
 * + (0.8 × SG Around Green)
 */

export function calculateCGI(player) {
  const approach = player.sg_approach ?? 0;
  const offTheTee = player.sg_off_tee ?? 0;
  const putting = player.sg_putting ?? 0;
  const aroundGreen = player.sg_around_green ?? 0;

  return (
    (1.5 * approach) +
    (1.2 * offTheTee) +
    (1.0 * putting) +
    (0.8 * aroundGreen)
  );
}

export function calculateAverageCGI(players) {
  return players.map((player) => ({
    ...player,
    cgi: calculateCGI(player),
  }));
}