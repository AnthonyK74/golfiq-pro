import "dotenv/config";
import { importHistory } from "./importer.js";

async function main() {
  console.log("=================================");
  console.log(" GolfIQ Database Import");
  console.log("=================================");

  try {
    await importHistory();

    console.log("");
    console.log("✅ Import complete.");
  } catch (err) {
    console.error(err);
  }
}

main();