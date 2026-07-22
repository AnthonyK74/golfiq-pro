import { importHistory } from "../api/importer";

export default function DatabaseTools() {
  async function handleImport() {
    await importHistory();
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>GolfIQ Database Tools</h1>

      <button onClick={handleImport}>
        Import 2024–2026 History
      </button>
    </div>
  );
}