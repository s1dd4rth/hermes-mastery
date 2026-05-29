# Hermes Mastery

A guided course teaching [Hermes](https://hermes-agent.nousresearch.com/) by Nous Research, modeled on [OpenClaw Mastery](https://github.com/s1dd4rth/openclaw-mastery). 10 modules from install (M1) through multi-profile (M9) to a deterministic completion code (M10).

**Live:** <https://s1dd4rth.github.io/hermes-mastery/>

## How it works

1. Install the validator skill ([s1dd4rth/hermes-mastery-validator](https://github.com/s1dd4rth/hermes-mastery-validator)) into your Hermes setup — clone + symlink as described in that repo's README (Hub install is not available for v0.1.0-alpha).
2. Open the live course site and pick a module.
3. Each module has phases with learn / do / verify steps. The verify step asks your Hermes agent to run `verify_module` and paste back a JSON envelope.
4. The web app applies the JSON results to your progress tracker, surfaces any drift evidence, and aggregates M1–M9 into an `HMS-` completion code at M10.

## Architecture

- **Validator:** zero-dependency Node CLI ([s1dd4rth/hermes-mastery-validator](https://github.com/s1dd4rth/hermes-mastery-validator)) pinned as a git submodule at `hermes-mastery-validator/`. Each web app release pins a specific validator commit for atomic versioning.
- **Web app:** Vite + React 19 + TypeScript + Tailwind 4. Deployed to GitHub Pages via `.github/workflows/deploy.yml`.
- **Drift evidence:** the validator emits `integrity { source: "local-manifest" | "none", status: "DRIFT_OK" | "DRIFT_MODIFIED" | "UNKNOWN" }`. The web app surfaces a red banner on `DRIFT_MODIFIED`. See spec §7.2 (v4).

## Local dev

```bash
git clone --recurse-submodules https://github.com/s1dd4rth/hermes-mastery.git
cd hermes-mastery
bun install
bun run dev
```

## Course materials

All specs and plans live in the [OpenClaw Mastery](https://github.com/s1dd4rth/openclaw-mastery) repo:

- **Spec (v4):** [docs/superpowers/specs/2026-05-22-hermes-mastery-design.md](https://github.com/s1dd4rth/openclaw-mastery/blob/main/docs/superpowers/specs/2026-05-22-hermes-mastery-design.md)
- **Plan (v2):** [docs/superpowers/plans/2026-05-23-hermes-mastery-build.md](https://github.com/s1dd4rth/openclaw-mastery/blob/main/docs/superpowers/plans/2026-05-23-hermes-mastery-build.md)
- **Launch checklist (v0.1.0-alpha):** [docs/superpowers/launch-checklists/2026-05-28-hermes-v0.1.0-alpha.md](https://github.com/s1dd4rth/openclaw-mastery/blob/main/docs/superpowers/launch-checklists/2026-05-28-hermes-v0.1.0-alpha.md)

## License

MIT.
