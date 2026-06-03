# Hermes Mastery — Course Redesign (outcome-first)

**Date:** 2026-06-02
**Status:** Approved spine; ready for implementation plan
**Author:** Siddarth + Claude

## 1. Problem

The current course is a **config tour** inherited from OpenClaw Mastery: 10 modules of
"edit this file / run this command / paste validator JSON," each shaped as Learn → Do →
Verify and gated on deterministic checks that aggregate into an `HMS-` completion code.

It teaches **mechanics, not outcomes.** The thing that makes Hermes special — a persistent
personal agent reachable from your phone that does real work and improves over time — is
buried at module 4 of 10 and framed as plumbing. The module order follows OpenClaw's config
dependency graph, not a narrative that builds excitement.

Two well-regarded Hermes treatments confirm the gap:

- **Keith Rumjahn's guide** (rumjahn.substack.com/p/complete-guide-to-mastering-hermes) is
  outcome-first: sleep → morning health report on Telegram, Monday 8:30am sales-report cron,
  hourly proactive "heartbeat" insights. Framing: *"I stopped using AI like a chat. I started
  running a system."* He calls cron *"the heart of what makes Hermes different"* and grounds it
  in Karpathy's "LLM Wiki" idea (an agent that persists and improves). He notes *"most tutorials
  skip"* editing the identity files — i.e. the chore-ish part our course over-indexes on.
- **The Udemy course** "Hermes Agent: Build a Self-Improving AI Agent" is project-based and
  capability-deep: real workflows (fitness, email+calendar, smart home, repo monitoring) plus
  signature power features our course barely touches — MCP servers, subagents/multi-agent
  delegation, hooks, plugins, self-improving skills, local models, RAG.

Both are **outcome/system-first**; ours is **mechanics/config-first**. That is the core problem.

## 2. The reframe

**Old identity:** a config checklist. **New identity:**

> *Install Hermes, give it your accounts, and it becomes a persistent personal agent that does
> real things for you — and gets better over time.*

Outcome-first. Every module is a **felt win**. Config is the means, never the lesson. The proof
of an outcome is the outcome happening (a text arriving on your phone), not a file-stat passing.

## 2b. Post-implementation updates (2026-06-03)

After the initial rewrite, two Hermes developments were folded in:

- **Desktop app.** Hermes now ships a standalone desktop app (macOS DMG, Windows EXE;
  `hermes-assets.nousresearch.com/Hermes-Setup.dmg|.exe`). It wraps the installer, **shares
  the same install + data dir as the CLI, and puts `hermes` on PATH** — so app and terminal
  are interchangeable doors into one agent. M1 now leads with the desktop download (friendly
  default) but keeps the course terminal-driven (the steps are copy-pasteable and M2–M10 are
  CLI-based). `pip install hermes-agent` noted as a third path.
- **M8 = real multi-agent platform (Kanban), not the delegate tool.** v0.15 ships
  `hermes kanban swarm`: a durable board where named **profiles** (specialist clones) claim
  tasks and run in parallel — root/blackboard → workers → verifier → synthesizer — plus
  `--goal` (self-checking loop against acceptance criteria) and `--workspace`. M8 teaches this
  (requires `hermes profile create <name>` for each role first), with a fallback note that the
  in-chat delegate tool covers simpler jobs on older builds.

Smaller release-note touch-ups (v0.13–v0.15.2): M5 notes built-in **promptware/injection
defense** layering under the SOUL rule; M3 names the rebuilt **session search** as a recall
capability.

**Verification status (2026-06-03):** the sandbox was updated v0.12.0 → **v0.15.1** and the
whole course re-verified against the real CLI. Notably this caught that `hermes kanban swarm`
uses `--worker PROFILE:TITLE` (singular, repeatable) with `--verifier`/`--synthesizer` both
**required** — the docs implied `--workers a,b` with optional synthesizer. M8 was corrected and
the swarm was run end-to-end (root→worker→verifier→synthesizer graph confirmed via
`hermes kanban list`). M2 cron, M3 memory, M6 curator, M7 mcp, M9 `setup tts` all confirmed
present on v0.15.1. The course no longer rests on doc inference for any module.

## 3. The new spine

### CORE TRACK — felt outcomes

| # | Outcome (the hook) | Hermes features it teaches (the means) |
|---|---|---|
| 1 | An agent that's alive and on your phone | install, `hermes setup`, model, Telegram gateway — the killer combo on day one |
| 2 | It greets you every morning with your brief | cron ("heartbeat") + memory (USER.md / MEMORY.md) working together |
| 3 | It knows you and remembers across weeks | the memory files + Curator, framed as "your agent's growing knowledge of you" |
| 4 | It triages your inbox & calendar | Gmail/Calendar skill + the outbound-approval safety gate |
| 5 | It researches and reports back | web tools + a research-brief skill + prompt-injection safety |
| 6 | It improves itself | the self-improving loop — Curator, session memory, evidence you can point at |

### POWER TRACK — depth

| # | Outcome | Feature |
|---|---|---|
| 7 | Give it superpowers | MCP servers |
| 8 | A team of agents | subagents & multi-agent delegation |
| 9 | Talk to it | voice mode |
| 10 | It writes its own skills | self-improving / custom skills, "make it yours" |

### Shifts from the current course

- **Cron + memory move to the front** (modules 2–3, not 6). Cron is the "heartbeat" that makes
  Hermes feel alive; it earns an early slot.
- **SOUL / personality stops being a standalone chore module.** It folds into "make it yours"
  moments inside each outcome (give the morning-brief agent a voice, give the inbox agent its
  guardrails) rather than a dedicated "edit SOUL.md" module.
- **The validator + HMS completion-code machinery is retired entirely** (see §5).
- **MCP, subagents, voice** — absent from the current course — become the power track.
- **Telegram moves from M4 to M1.** The phone-reachable agent is the killer combo and belongs
  on day one, not buried mid-course.

## 4. Module shape

Every module follows: **Hook → Build → See it → Make it yours.**

1. **The payoff (hook)** — open with the felt outcome: *"By the end of this, your agent texts
   you a brief every morning at 8am."* The outcome is front-loaded, not the reward for slogging
   through config.
2. **Build it** — the means: paste-to-Hermes prompts and the minimum config required. Config is
   compressed and instrumental, never the focus.
3. **See it happen** — the real proof: the cron fires, the text arrives, the inbox gets
   summarized. This replaces "paste validator JSON."
4. **Make it yours + self-check** — a short "tweak it for you" (voice, schedule, scope) and a
   simple self-attested checkpoint the learner ticks ("Did your agent text you? ✓").

This keeps a consistent rhythm without the rigid Learn/Do/Verify-validator template. It also
preserves the manual/agent distinction we already built (a Do block exists only when there's a
real message to paste to the agent; terminal/editor commands live in the Hook/Build prose).

## 5. Validator retirement

**Decision: drop the validator and HMS machinery; go lightweight self-attested checkpoints.**

Rationale: in an outcome-first course, the real proof of "your agent texts you a morning brief"
is *the text arriving* — inherently a behavioral/manual check, not a deterministic file-stat. The
validator is good at "USER.md exists," weak at "the outcome happened." Keeping it would keep the
tail wagging the dog.

### What this removes (web app — net deletion, not rewrite)

- `src/components/steps/PasteValidatorOutput.tsx`
- `src/components/validation/ValidationDashboard.tsx`
- `src/data/validator.ts`, `src/data/liveApi.ts`
- `src/hooks/useLiveApiSettings.ts`
- `src/data/featureFlags.ts` (paste-validator + live-API flags) — review for anything still used
- The `hermes-mastery-validator` git submodule + `.gitmodules` entry
- Validator-specific bits of `StepEngine.tsx` / `StepVerify.tsx` / `CheckResult.tsx` /
  `useStepProgress.ts` (the verify-results-by-check-id machinery)

### What replaces it

- A lightweight self-check per module: the learner ticks "I saw this happen." Progress tracking
  stays (keyed by step/module id) but no longer depends on validator JSON or check results.
- **Completion code:** retire `HMS-` aggregation. Optionally a trivial finish-line token; default
  is no code unless we decide otherwise during implementation.
- `CelebrationCard` / M10 completion screen stays as a finish-line celebration, decoupled from the
  validator-computed code.

### Type/data implications

`src/data/types.ts` `verify.checks[]` (CheckItem with verifyPrompt/failHint/fixPrompt) is replaced
by a simpler self-check concept (a checkpoint label the learner ticks). `useStepProgress` drops
`setVerifyResults` / per-check state and keeps step-complete + nav + user-input persistence.

## 6. Content sourcing & correctness

All Hermes facts must match **live Hermes v0.15.1** (not the v0.12.0 the original was written
against). The ground-truth already established this session (canonical install URL, `hermes setup`,
terminal-first / no `:1919` dashboard, `hermes dashboard` on 9119, `model.provider` nested key,
skills clone+symlink fallback because Hub fetch is flaky, no `hermes search` CLI, SOUL.md loaded
fresh each message, profile CLI surface, delegate tool vs cross-profile RPC) carries forward and is
recorded in project memory. New power-track modules (MCP, subagents, voice) must be verified
against the live install / official docs before shipping, same as every other claim.

## 7. Stack (unchanged)

Vite + React 19 + TypeScript + Tailwind 4, deployed to GitHub Pages on push to `main`. Content
lives in `src/data/modules.ts`. The redesign is primarily (a) a rewrite of `modules.ts` around the
new spine and (b) deletion of the validator subsystem. No new frameworks.

## 8. Out of scope (for this spec)

- Exact prose of each module's Hook/Build/See-it copy — produced during implementation.
- Power-track depth beyond the four named outcomes (7–10).
- Any backend / live-API integration (explicitly retired).
- Visual / design-system changes beyond what removing the validator panels requires.

## 9. Open questions to resolve during planning

- Does the morning-brief outcome (M2) require Telegram delivery (depends on M1 gateway), or can it
  fall back to local/dashboard delivery for learners who skip Telegram? (Cron `deliver: local`
  default is relevant.)
- M4 inbox triage depends on Google OAuth, the heaviest setup in the course — keep in core, or
  move to power track? (Currently core; revisit if it kills completion rate.)
- Whether to keep a trivial completion token at all (§5).
