# El-boost · EICR Voice

Voice-driven EICR (BS 7671) report filler for electricians. Mobile-first, reports stay on the phone.

Live: https://artemmeush33.github.io/El-boost

- `index.html`: the app (heat map, Talk, built-in parser, export)
- `eicr-template.html`: printable report template used by Save PDF
- `config.js`: address of the optional AI server
- `ai-server/`: Cloudflare Worker that adds Claude. See `ai-server/SETUP.md`

Sample data is fake. Never commit real client reports: this repo is public.
