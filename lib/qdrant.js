// Check if Qdrant is configured for production
function isQdrantConfigured() {
  const url = process.env.QDRANT_URL;
  return !!(url && !url.includes("localhost") && !url.includes("127.0.0.1"));
}

export async function searchQdrant({ queryEmbedding, limit = 3 }) {
  if (!isQdrantConfigured()) {
    console.log("[No Qdrant] Skipping vector search - Qdrant not configured for production");
    return [];
  }

  const url = process.env.QDRANT_URL;
  const apiKey = process.env.QDRANT_API_KEY;
  const collection = process.env.QDRANT_COLLECTION || "knowledge-base";

  try {
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
      console.error(`Qdrant error: ${response.status} ${text}`);
      return [];
    }

    const data = await response.json();
    return data?.result || [];
  } catch (error) {
    console.error("Qdrant search failed:", error.message);
    return [];
  }
}
