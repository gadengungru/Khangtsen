# AlpacApps Infra

A starter template for building full-stack business platforms with Claude Code. Set up messaging, marketing, customer management, and finance — all on free or near-free infrastructure.

## What you get

- **Database + Auth + Storage** — Supabase (free)
- **Website + Hosting** — GitHub Pages (free)
- **Email** — Resend (free, 3,000/month)
- **SMS** — Telnyx (~$0.004/message)
- **Payments** — Square (2.9% + 30¢)
- **E-Signatures** — SignWell (free, 3–25 docs/month)
- **AI Features** — Google Gemini (free)
- **AI Developer** — Claude Code (builds and manages everything)

## Quick start

1. **Clone this repo** — replace `my-project` with your project name (this will also become your GitHub repo name, so pick something unique — lowercase, hyphens, no spaces):
   ```bash
   git clone https://github.com/rsonnad/alpacapps-infra.git my-project
   cd my-project
   ```

2. **Open in Claude Code** (desktop app or CLI):
   ```bash
   claude
   ```

3. **Run the setup skill**:
   ```
   /setup-alpacapps-infra
   ```

Claude will create your own GitHub repo, disconnect from this starter template, then walk you through setting up each service interactively — creating your database, deploying edge functions, configuring webhooks, and building your CLAUDE.md.

## What happens during setup

The setup skill will:
1. Ask what you're building and which services you need
2. Create a new GitHub repo under your account (using the folder name you chose)
3. Disconnect from the `alpacapps-infra` template origin
4. Set up Supabase, deploy edge functions, configure webhooks
5. Build your `CLAUDE.md` with all credentials and connection details
6. Push everything to your new repo — your site goes live on GitHub Pages

## Full guide

Read the complete infrastructure guide at: https://rsonnad.github.io/alpacapps/docs/alpacappsinfra.html

## License

AGPL-3.0 — see [LICENSE](LICENSE). If you modify and distribute this, you must share your changes under the same license.
