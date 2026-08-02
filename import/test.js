import "dotenv/config";
import { getTournamentResults } from "./golfApi.js";

const response = await getTournamentResults(1);

console.log(JSON.stringify(response, null, 2));