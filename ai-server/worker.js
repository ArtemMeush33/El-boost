// EICR Voice — AI server (Cloudflare Worker)
// Turns a spoken site note into field updates using Claude.
// The API key lives in Cloudflare as a secret named ANTHROPIC_API_KEY. It is never in this repo.

const ALLOWED_ORIGINS = ["https://artemmeush33.github.io"];
const MODEL = "claude-haiku-5-5";
const PROMPT_START = "Convert an electrician's spoken site note";

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Vary": "Origin",
  };
}
const json = (body, status, origin) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...cors(origin) } });

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { headers: cors(origin) });
    if (request.method !== "POST") return json({ error: "POST only" }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: "origin not allowed" }, 403, origin);

    let prompt;
    try { ({ prompt } = await request.json()); } catch { return json({ error: "bad json" }, 400, origin); }
    // Only accept the app's own prompt, so the key can't be used as a general chatbot.
    if (typeof prompt !== "string" || !prompt.startsWith(PROMPT_START) || prompt.length > 30000)
      return json({ error: "bad prompt" }, 400, origin);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 600, messages: [{ role: "user", content: prompt }] }),
    });
    if (!r.ok) return json({ error: "ai " + r.status }, 502, origin);

    const data = await r.json();
    const text = (data.content || []).map((c) => c.text || "").join("");
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return json({ error: "no json from ai" }, 502, origin);
    try { return json(JSON.parse(m[0]), 200, origin); }
    catch { return json({ error: "bad json from ai" }, 502, origin); }
  },
};
