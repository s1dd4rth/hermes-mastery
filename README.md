# Hermes Mastery

A guided course teaching [Hermes](https://hermes-agent.nousresearch.com/) by Nous Research. An outcome-first course: each module gets your agent doing something real for you — from a phone-reachable agent (M1) through a morning brief, inbox triage, and research, to a self-improving setup that runs itself.

**Live:** <https://s1dd4rth.github.io/hermes-mastery/>

## How it works

1. Open the live course site and pick a module.
2. Each module follows **Hook → Build → See it → Make it yours**: it opens with the payoff, you build it (often by pasting a prompt straight to your Hermes agent), then you watch it actually happen.
3. Confirm the outcome with a lightweight self-check — tick each "see it happen" checkpoint once your agent has actually done it. Progress is tracked locally in your browser.

## Architecture

- **Web app:** Vite + React 19 + TypeScript + Tailwind 4. Deployed to GitHub Pages via `.github/workflows/deploy.yml`.
- **Content:** all course modules live in `src/data/modules.ts`.
- **Progress:** step completion + self-checks are persisted in `localStorage` (no backend, no account).

## Local dev

```bash
git clone https://github.com/s1dd4rth/hermes-mastery.git
cd hermes-mastery
bun install
bun run dev
```

## Course materials

Design docs for the outcome-first redesign live in this repo:

- **Redesign spec:** [docs/superpowers/specs/2026-06-02-hermes-course-redesign.md](docs/superpowers/specs/2026-06-02-hermes-course-redesign.md)
- **Engine teardown plan:** [docs/superpowers/plans/2026-06-02-validator-teardown-engine.md](docs/superpowers/plans/2026-06-02-validator-teardown-engine.md)

## License

MIT.
