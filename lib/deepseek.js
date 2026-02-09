const DEFAULT_BASE = "https://api.deepseek.com/v1";

export async function deepseekChat({ messages, system }) {
  const baseUrl = process.env.DEEPSEEK_BASE_URL || DEFAULT_BASE;
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_CHAT_MODEL || "deepseek-chat",
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...messages,
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DeepSeek error: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

export async function deepseekEmbed(text) {
  const baseUrl = process.env.DEEPSEEK_BASE_URL || DEFAULT_BASE;
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_EMBED_MODEL || "deepseek-embedding",
      input: text,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DeepSeek embedding error: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data?.data?.[0]?.embedding || [];
}
