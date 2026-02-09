export async function searchQdrant({ queryEmbedding, limit = 3 }) {
  const url = process.env.QDRANT_URL;
  const apiKey = process.env.QDRANT_API_KEY;
  const collection = process.env.QDRANT_COLLECTION || "knowledge-base";

  if (!url) {
    throw new Error("QDRANT_URL is not set");
  }

  const response = await fetch(`${url}/collections/${collection}/points/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "api-key": apiKey } : {}),
    },
    body: JSON.stringify({
      vector: queryEmbedding,
      limit,
      with_payload: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Qdrant error: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data?.result || [];
}
