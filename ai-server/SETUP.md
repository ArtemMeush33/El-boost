# AI server setup (about 10 minutes, once)

Without this, Talk still works with the built-in parser. This adds Claude for messy or unusual notes.

1. **API key**: go to console.anthropic.com → API Keys → Create key. Add a small credit (e.g. £5). Copy the key.
2. **Cloudflare**: sign up free at dash.cloudflare.com → Workers & Pages → Create → Worker → name it `eicr-ai` → Deploy.
3. **Code**: click *Edit code*, delete what's there, paste everything from `ai-server/worker.js`, then *Deploy*.
4. **Key**: Worker → Settings → Variables and Secrets → Add → type **Secret**, name `ANTHROPIC_API_KEY`, paste the key → Save.
5. **Address**: copy the Worker address (like `https://eicr-ai.yourname.workers.dev`) and send it to Claude.
   Claude puts it in `config.js`. The address is safe to share; the key is not.

Never paste the API key into chat or into GitHub.
