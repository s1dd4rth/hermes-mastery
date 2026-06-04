# Changelog

All notable changes to the Hermes Mastery web app.

## [0.2.0] — 2026-06-03 — Outcome-first redesign

Complete rethink. The course was a config tour ported from OpenClaw ("edit this file / run
this command / paste validator JSON"); it's now an **outcome-first** course where every module
is a felt win following **Hook → Build → See it → Make it yours**. All content verified against
a live Hermes **v0.15.1** install. Spec: `docs/superpowers/specs/2026-06-02-hermes-course-redesign.md`;
teardown plan: `docs/superpowers/plans/2026-06-02-validator-teardown-engine.md`.

### Changed
- **All 10 modules rewritten.** Core track: M1 *Your Agent, On Your Phone* (install + Telegram
  on day one), M2 *It Greets You Every Morning* (cron heartbeat), M3 *It Knows You and Remembers*
  (memory), M4 *It Triages Your Inbox* (Gmail + approval gate), M5 *It Researches and Reports Back*
  (web + research skill + injection safety), M6 *It Improves Itself* (Curator + memory + skills).
  Power track: M7 *Give It Superpowers* (MCP), M8 *A Team of Agents* (`hermes kanban swarm`),
  M9 *Talk to It* (voice), M10 *It Writes Its Own Skills*.
- **M1 leads with the desktop app** (macOS DMG / Windows EXE), terminal framed as the course's
  tool; `pip install` noted as a third path.
- Corrected several OpenClaw-era myths against real v0.15.1: no `:1919` dashboard (it's `:9119`),
  `hermes onboard`→`hermes setup`, SOUL.md loaded fresh each message, Curator curates *skills*
  not memory, no `hermes search` CLI, real `kanban swarm` flag syntax.

### Removed
- **The entire validator subsystem.** Retired the `hermes-mastery-validator` git submodule, the
  paste-validator UI, `validator.ts` / `liveApi.ts` / `featureFlags.ts` / `ValidationDashboard` /
  `CompletionCodeBanner` / `StepVerify` / `useLiveApiSettings`, and the deterministic `HMS-`
  completion code (~1,900 lines net removed).

### Added
- **Step-based progress + self-checks.** `Step.selfChecks` ({id,label}) ticked by the learner;
  progress counts completed steps. `CelebrationCard` is now a no-code finish card.

## [0.1.0-alpha.1] — 2026-05-29

Post-launch polish. Browser smoke caught three bugs that automated checks missed; we also
adopted the actual Nous brand palette and restructured the M10 completion flow.

### Added
- **Celebrate phase (M10 Phase 4).** New `CelebrationCard` component renders a 1200×630
  canvas-based completion card with the Hermes wordmark, the user's HMS- code in big amber
  Courier Prime, a 3-column stats grid, per-module tally, and amber glow. Three share buttons:
  Share on X (Twitter intent URL), Copy image (Clipboard API), Download PNG. CSS-only sparkle
  confetti on mount.
- **Nous brand palette.** Switched from the violet placeholder to the actual Nous Hermes
  palette extracted from https://hermes-agent.nousresearch.com/: dark warm-brown background
  `#170d02`, white foreground, amber primary `#ffbd38`, cream secondary `#ffe6cb`, Courier
  Prime mono. `html { color-scheme: dark }`. New `hermes-cream` token; `.hermes-glow` utility.
  13 components adapted for dark-mode contrast (verify items, banners, mastery meter, etc.).
- **`getModuleVerifyResults(moduleId)` helper** in `App.tsx` that merges `verifyResults`
  across all phases/steps of a module. Lets `CompletionCodeBanner` render correctly on any
  M10 phase, not just the phase where the validator output was pasted.

### Changed
- `claw-reviewed-setup` check ID → `hermes-reviewed-setup` (matching the validator rename).
  The HMS- completion code is unaffected because the canonical-form hash uses per-module
  pass/fail counts, not check IDs.
- ~20 user-facing strings: "your Claw" / "ask your Claw" / "Copy & Paste to Claw" → "your
  Hermes" / "ask your Hermes" / "Copy & Paste to Hermes" across 7 files.
- M10 phase shape: dropped "Get Your Completion Code" (Phase 4) and "Submit the Course
  Assessment" (Phase 5, Google Form — OpenClaw legacy). Replaced with a single Celebrate
  phase. Now 4 phases total.
- `CompletionCodeBanner` no longer renders on the Celebrate phase (redundant with the
  CelebrationCard which surfaces the code more prominently).

### Removed
- `src/components/ui/LogoIcon.tsx` — dead OpenClaw lobster-logo SVG, never imported.

### Fixed
- CompletionCodeBanner appearing only on Phase 3 instead of also showing on Phase 4 where
  users expect it (the original learn text promised "displayed above" but lied).

### Tag

[`v0.1.0-alpha.1`](https://github.com/s1dd4rth/hermes-mastery/releases/tag/v0.1.0-alpha.1) @
commit `17bc875`.

---

## [0.1.0-alpha] — 2026-05-28

Initial public release of the Hermes Mastery course web app.

### Added
- Vite + React 19 + TypeScript + Tailwind 4 web app deployed to GitHub Pages at
  https://s1dd4rth.github.io/hermes-mastery/.
- 10 course modules: M1 Install, M2 Memory, M3 Soul, M4 Telegram, M5 Skills, M6 Crons,
  M7 Web Tools, M8 Gmail+Calendar (OAuth), M9 Multi-Profile, M10 Completion +
  Self-Improving Loop.
- Paste-validator panel that accepts the validator's JSON envelope and auto-applies check
  results to the learner's progress meter.
- Drift-evidence banner (red `DRIFT_MODIFIED`, neutral `UNKNOWN`, none on `DRIFT_OK`) wired
  to the validator's new `integrity { source, status }` envelope.
- Deterministic `HMS-<base32>` completion-code surfaced via `CompletionCodeBanner` once the
  M10 validator output is pasted.
- Git submodule pointing at `s1dd4rth/hermes-mastery-validator`.
- Staging deploy workflow (`.github/workflows/deploy-staging.yml`) — build-only, no Pages
  publish, runs on push to `staging` and PRs to `main`.

### References
- Spec: [openclaw-mastery/docs/superpowers/specs/2026-05-22-hermes-mastery-design.md](https://github.com/s1dd4rth/openclaw-mastery/blob/main/docs/superpowers/specs/2026-05-22-hermes-mastery-design.md) (v4)
- Plan: [openclaw-mastery/docs/superpowers/plans/2026-05-23-hermes-mastery-build.md](https://github.com/s1dd4rth/openclaw-mastery/blob/main/docs/superpowers/plans/2026-05-23-hermes-mastery-build.md) (v2)
- Launch checklist: [openclaw-mastery/docs/superpowers/launch-checklists/2026-05-28-hermes-v0.1.0-alpha.md](https://github.com/s1dd4rth/openclaw-mastery/blob/main/docs/superpowers/launch-checklists/2026-05-28-hermes-v0.1.0-alpha.md)
