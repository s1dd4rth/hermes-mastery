import { Server, Shield, CheckCircle, Brain, BookOpen, MessageSquare } from 'lucide-react';
import type { Module } from './types';

// M1-only skeleton — further modules added as the course builds out.
export const MODULES_DATA: Module[] = [
  {
    id: 'm1',
    title: 'M1: Install & Foundation',
    shortTitle: 'M1 — Install',
    description:
      'Install Hermes, configure your model, install the validator skill, and verify the gateway.',
    icon: Server,
    phases: [
      // ── Phase 1: Install ────────────────────────────────────────────────
      {
        id: 'install',
        title: 'Phase 1: Install',
        icon: Server,
        steps: [
          {
            id: 'install-hermes',
            title: 'Install Hermes',
            learn:
              'Hermes is a local-first AI orchestrator that runs on your machine. Install it with the canonical one-liner:\n\n```\ncurl -fsSL https://gethermes.ai/install.sh | bash\n```\n\nOnce installed, verify with:\n\n```\nhermes --version\n```\n\nYou should see a version string like `hermes v0.12.0`. If the command is not found, open a new shell so the `PATH` update from the installer takes effect, then try again.\n\n**Apple Silicon note:** the installer places the binary at `/opt/homebrew/bin/hermes` on M1/M2/M3 Macs. On Intel Macs and Linux it goes to `/usr/local/bin/hermes`. Either location is fine as long as it is on your `PATH`.',
            do: {
              prompt:
                'Run `hermes --version` and report the output. Just the version string, one line.',
            },
            verify: {
              checks: [
                {
                  id: 'hermes-installed',
                  label: '`hermes --version` succeeds',
                  verifyPrompt:
                    'Run `hermes --version`. Respond ONLY with this JSON: {"checks":[{"id":"hermes-installed","pass":true,"detail":"hermes v<version>"}]} — set pass to false if the command fails or returns an error.',
                  failHint:
                    'If `hermes: command not found`, open a fresh terminal session so the installer\'s PATH update takes effect. If that does not help, re-run the install script.',
                  fixPrompt:
                    'Open a new terminal session, run `hermes --version` again, and report the result.',
                },
              ],
            },
          },
          {
            id: 'setup-wizard',
            title: 'Run the Setup Wizard',
            learn:
              'After install, run the Hermes onboarding wizard:\n\n```\nhermes onboard\n```\n\nThe wizard walks you through:\n1. Choosing a model provider (Anthropic, OpenAI, or Google)\n2. Pasting your API key\n3. Naming your agent\n4. Setting a gateway port (default: 1919)\n\nWork through each prompt. When the wizard completes, the Hermes dashboard opens at `http://localhost:1919` in your browser.',
            do: {
              prompt:
                'Run `hermes onboard` and follow the prompts. When done, open `http://localhost:1919` in your browser and confirm the dashboard loads. Report back: which model provider did you choose, and does the dashboard respond?',
            },
          },
          {
            id: 'choose-model',
            title: 'Choose Your Model',
            learn:
              'Hermes supports three model providers. Your choice affects cost, personality, and latency:\n\n- **Anthropic (Claude):** Best for long-form writing and careful reasoning. Claude Sonnet 4 is the recommended starting model. Requires billing at [console.anthropic.com](https://console.anthropic.com).\n- **OpenAI (GPT):** Fastest and widely compatible. GPT-4o is a solid default. Requires billing at [platform.openai.com](https://platform.openai.com).\n- **Google (Gemini):** Most cost-efficient; free tier available at [aistudio.google.com](https://aistudio.google.com).\n\nThe `model.provider` key in `~/.hermes/config.yaml` stores your choice. You can switch providers anytime by editing this file and restarting the gateway.\n\n**Check your current config:**\n```\ncat ~/.hermes/config.yaml | grep -A2 model\n```',
            do: {
              prompt:
                'Show me the `model` section of `~/.hermes/config.yaml`. Run: `cat ~/.hermes/config.yaml | grep -A5 "^model"`. Reply with just the yaml block.',
            },
            verify: {
              checks: [
                {
                  id: 'model-configured',
                  label: '`model.provider` is set in config',
                  verifyPrompt:
                    'Read the `model.provider` value from `~/.hermes/config.yaml`. Respond ONLY with this JSON: {"checks":[{"id":"model-configured","pass":true,"detail":"model.provider: <value>"}]} — set pass to false if the key is missing or empty.',
                  failHint:
                    'If `model.provider` is missing, run `hermes onboard` again and pick a provider, or manually add it to `~/.hermes/config.yaml`.',
                  fixPrompt:
                    'Open `~/.hermes/config.yaml` and confirm the `model.provider` key is present with a non-empty value (anthropic, openai, or google).',
                },
              ],
            },
          },
        ],
      },

      // ── Phase 2: Validator ──────────────────────────────────────────────
      {
        id: 'validator',
        title: 'Phase 2: Validator',
        icon: Shield,
        steps: [
          {
            id: 'install-validator-skill',
            title: 'Install the Validator Skill',
            learn:
              'The course uses a companion Hermes skill called `hermes-mastery-validator` to verify your setup at the end of each module. Instead of ticking checkboxes by hand, the skill inspects your actual Hermes state — config values, files, the gateway — and returns a structured pass/fail JSON report this app reads.\n\nIt is read-only. It never modifies your setup, never displays secrets.\n\n**Install:**\n\n```\nhermes skills install s1dd4rth/hermes-mastery-validator\n```\n\nThis fetches the skill from the Hermes skill registry. Once installed, start a fresh Hermes session and verify:\n\n```\nhermes skills list\n```\n\n`hermes-mastery-validator` should appear in the output.\n\n**If install fails (registry not yet live):** use the local path method:\n\n```\nmkdir -p ~/.hermes/skills\ngit clone https://github.com/s1dd4rth/hermes-mastery-validator ~/.hermes/skills/hermes-mastery-validator\n```\n\nStart a fresh Hermes session to pick up the new skill.',
            do: {
              prompt:
                'Install the hermes-mastery-validator skill. First try:\n```\nhermes skills install s1dd4rth/hermes-mastery-validator\n```\nIf the registry is unreachable, fall back to:\n```\nmkdir -p ~/.hermes/skills && git clone https://github.com/s1dd4rth/hermes-mastery-validator ~/.hermes/skills/hermes-mastery-validator\n```\nThen run `hermes skills list` and confirm `hermes-mastery-validator` appears. Report the install method used and whether the skill shows up in the list.',
            },
            verify: {
              checks: [
                {
                  id: 'validator-skill-installed',
                  label: '`~/.hermes/skills/hermes-mastery-validator/SKILL.md` is present',
                  verifyPrompt:
                    'Check whether the file `~/.hermes/skills/hermes-mastery-validator/SKILL.md` exists. Respond ONLY with this JSON: {"checks":[{"id":"validator-skill-installed","pass":true,"detail":"SKILL.md found at ~/.hermes/skills/hermes-mastery-validator/SKILL.md"}]} — set pass to false if the file is missing.',
                  failHint:
                    'The file is missing. Confirm the git clone completed and the target path is exactly `~/.hermes/skills/hermes-mastery-validator/SKILL.md`.',
                  fixPrompt:
                    'Run: `ls ~/.hermes/skills/hermes-mastery-validator/SKILL.md` — if missing, re-run: `git clone https://github.com/s1dd4rth/hermes-mastery-validator ~/.hermes/skills/hermes-mastery-validator`',
                },
              ],
            },
          },
          {
            id: 'verify-gateway',
            title: 'Verify Gateway',
            learn:
              'Before running the module validator, confirm the Hermes gateway is responding. The gateway serves the dashboard at `http://localhost:1919` and handles all skill invocations.\n\nIf the dashboard does not load, start the gateway:\n\n```\nhermes gateway start\n```\n\nFor a persistent background process (recommended on a machine that stays on):\n\n```\nhermes gateway start --daemon\n```\n\nOnce the gateway is running, the `hermes-mastery-validator` skill can be invoked from within Hermes sessions.',
            do: {
              prompt:
                'Confirm the Hermes gateway is running. Open `http://localhost:1919` in a browser and verify the dashboard loads. If it does not, run `hermes gateway start` and try again. Report: does the dashboard respond?',
            },
            verify: {
              checks: [
                {
                  id: 'gateway-running',
                  label: 'Dashboard reachable at 127.0.0.1:1919',
                  verifyPrompt:
                    'Check whether the Hermes dashboard at `http://127.0.0.1:1919` is reachable (try a curl or fetch). Respond ONLY with this JSON: {"checks":[{"id":"gateway-running","pass":true,"detail":"Dashboard responded with HTTP 200"}]} — set pass to false if the gateway does not respond.',
                  failHint:
                    'Run `hermes gateway start` in a terminal, wait a few seconds, then try again.',
                  fixPrompt:
                    'Run `hermes gateway start` and wait ~5 seconds, then re-check `http://127.0.0.1:1919`.',
                },
              ],
            },
          },
        ],
      },

      // ── Phase 3: Validation ─────────────────────────────────────────────
      {
        id: 'validation',
        title: 'Phase 3: Validation',
        icon: CheckCircle,
        steps: [
          {
            id: 'run-validator',
            title: 'Run Module 1 Validator',
            learn:
              'Now that Hermes is installed, your model is configured, the validator skill is in place, and the gateway is running — run the M1 validator to confirm all four checks pass.\n\nThe validator skill runs four deterministic checks:\n- `hermes-installed` — `hermes --version` succeeds\n- `gateway-running` — dashboard reachable at 127.0.0.1:1919\n- `model-configured` — `model.provider` is set in config\n- `validator-skill-installed` — SKILL.md is present\n\nPaste the JSON output into the panel below. The app updates the check results automatically.',
            do: {
              prompt:
                'Invoke the hermes-mastery-validator skill for module 1 and reply with the complete JSON output. The tool name is `hermes-mastery-validator` and the operation is `verify_module` with argument `module: 1`. Reply with only the raw JSON object — no prose, no markdown fence.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'm2',
    title: 'M2: Your Memory',
    shortTitle: 'M2 — Memory',
    description:
      'Learn the conversational-memory pattern: tell Hermes about yourself, confirm it writes to USER.md and MEMORY.md, then direct-edit both files for your identity and active projects.',
    icon: Brain,
    phases: [
      // ── Phase 1: Practice the "chuck that in memory" pattern ───────────
      {
        id: 'conversational-memory',
        title: 'Phase 1: Conversational Memory',
        icon: MessageSquare,
        steps: [
          {
            id: 'chuck-in-memory',
            title: 'Practice "Chuck That in Memory"',
            learn:
              'Hermes has two memory files it maintains automatically:\n\n- **`~/.hermes/memories/USER.md`** — who you are: your name, communication style, hard nopes. Capped at ~1,375 chars.\n- **`~/.hermes/memories/MEMORY.md`** — what you\'re working on: active projects, tools, open loops. Capped at ~2,200 chars.\n\nThe simplest way to populate them is to just tell the agent something in chat and ask it to remember:\n\n> "Chuck that in memory: I prefer terse responses."\n> "Remember that I\'m working on a SaaS dashboard project."\n> "My name is Alex — add that to USER.md."\n\nHermes writes the fact into the right file immediately. You can verify it landed by reading the file:\n\n```\ncat ~/.hermes/memories/USER.md\ncat ~/.hermes/memories/MEMORY.md\n```\n\nThis conversational round-trip — tell → write → read back — is the load-bearing exercise of M2.',
            do: {
              prompt:
                'Tell your Claw a new fact about yourself in chat. Try something like "remember that I prefer terse responses" or "chuck that in memory: I drink oat milk". After the agent responds, read USER.md or MEMORY.md and confirm the fact was written. Report: what did you tell it, and what did you find in the file?',
            },
          },
        ],
      },

      // ── Phase 2: Direct-edit USER.md ───────────────────────────────────
      {
        id: 'edit-user-md',
        title: 'Phase 2: Edit USER.md',
        icon: BookOpen,
        steps: [
          {
            id: 'direct-edit-user-md',
            title: 'Direct-Edit USER.md',
            learn:
              'You can also edit the memory files directly in your text editor. `~/.hermes/memories/USER.md` is a plain-text file — Hermes reads it at session start and uses it as context.\n\nRecommended structure for USER.md:\n\n```\nName: Your Name\nCommunication style: terse / verbose / Socratic / etc.\nHard nopes: never spend >$X via tools without asking first\n```\n\nKeep it under ~1,375 chars (the Hermes documented limit). The validator will warn if you\'re over, but won\'t fail — Hermes\'s limits may shift between versions.\n\n**Open the file:**\n\n```\nnano ~/.hermes/memories/USER.md\n# or: code ~/.hermes/memories/USER.md\n```\n\nAdd your name, how you want the agent to communicate, and at least one hard limit ("never book travel without confirmation", "never push to main without asking").',
            do: {
              prompt:
                'Open `~/.hermes/memories/USER.md` in your editor. Add or confirm: your name (real or a handle), your preferred communication style (terse/verbose/structured etc.), and at least one hard nope. Save the file. Run `wc -c ~/.hermes/memories/USER.md` and confirm it\'s under 1375 chars. Report what you set for each field.',
            },
          },
        ],
      },

      // ── Phase 3: Direct-edit MEMORY.md ─────────────────────────────────
      {
        id: 'edit-memory-md',
        title: 'Phase 3: Edit MEMORY.md',
        icon: BookOpen,
        steps: [
          {
            id: 'direct-edit-memory-md',
            title: 'Direct-Edit MEMORY.md',
            learn:
              '`~/.hermes/memories/MEMORY.md` captures your active context — what you\'re building, what tools you use, what decisions are in flight. Hermes injects this into every session so you don\'t have to re-explain your setup.\n\nRecommended structure for MEMORY.md:\n\n```\n- Working on: <project name> — <one-line description>\n- Stack: <tech>\n- Tools: <tool1>, <tool2>\n- Open loops: <decision or question pending>\n```\n\nOr prose — Hermes is flexible. The validator just checks that at least one project/context entry is present.\n\nKeep it under ~2,200 chars (informational limit, same caveat as USER.md).\n\n**Open the file:**\n\n```\nnano ~/.hermes/memories/MEMORY.md\n# or: code ~/.hermes/memories/MEMORY.md\n```',
            do: {
              prompt:
                'Open `~/.hermes/memories/MEMORY.md` in your editor. Add your current active project(s), the tech stack or tools you use, and any open decisions. Save. Run `wc -c ~/.hermes/memories/MEMORY.md` and confirm it\'s under 2200 chars. Report what you added.',
            },
          },
        ],
      },

      // ── Phase 4: Validation ─────────────────────────────────────────────
      {
        id: 'validation',
        title: 'Phase 4: Validation',
        icon: CheckCircle,
        steps: [
          {
            id: 'run-validator',
            title: 'Run Module 2 Validator',
            learn:
              'Run the M2 validator to confirm the memory files are in place with the right shape.\n\nThe validator runs three checks:\n- `user-md-exists` — USER.md present, non-empty, real identity field (not placeholder). Char limit 1375 informational.\n- `memory-md-exists` — MEMORY.md present, non-empty, at least one project/context entry. Char limit 2200 informational.\n- `memory-conversational` — **manual.** Confirm you completed the conversational round-trip in Phase 1 (tell → write → read back). The file-presence checks above only confirm the surface exists; this is what proves the memory loop works.\n\n**Important:** the deterministic checks are formatting checks only. A learner could hand-write any content and pass. The manual check is the real test.',
            do: {
              prompt:
                'Please run the verify_module command for module 2 and reply per the SKILL.md contract.',
            },
            verify: {
              checks: [
                {
                  id: 'user-md-exists',
                  label: 'USER.md exists with real identity field',
                  verifyPrompt:
                    'Check whether `~/.hermes/memories/USER.md` exists, is non-empty, and contains a real name or identity field (not a placeholder). Respond ONLY with this JSON: {"checks":[{"id":"user-md-exists","pass":true,"detail":"USER.md present with real identity field (length: N)"}]} — set pass to false if the file is missing, empty, or has only placeholder content.',
                  failHint:
                    'Create `~/.hermes/memories/USER.md` and add at least your name and communication style. The validator accepts formats like "Name: Alice", "username is alice", or "My name is Alice".',
                  fixPrompt:
                    'Open `~/.hermes/memories/USER.md` (create it if needed), add your name and at least one other field (communication style, hard nopes), then re-run the validator.',
                },
                {
                  id: 'memory-md-exists',
                  label: 'MEMORY.md exists with a project/context entry',
                  verifyPrompt:
                    'Check whether `~/.hermes/memories/MEMORY.md` exists, is non-empty, and contains at least one project or context entry. Respond ONLY with this JSON: {"checks":[{"id":"memory-md-exists","pass":true,"detail":"MEMORY.md present with project/context entry (length: N)"}]} — set pass to false if the file is missing, empty, or has no project/context mention.',
                  failHint:
                    'Create `~/.hermes/memories/MEMORY.md` and add at least one active project or tool you use (a bullet item, "working on X", or a backtick-quoted tool name are all accepted).',
                  fixPrompt:
                    'Open `~/.hermes/memories/MEMORY.md` (create it if needed), add your current active project(s) and tech/tools, then re-run the validator.',
                },
                {
                  id: 'memory-conversational',
                  label: 'Conversational memory round-trip completed (manual)',
                  verifyPrompt:
                    'Confirm you completed the conversational memory exercise in Phase 1: you told the agent a new fact, it wrote the fact to USER.md or MEMORY.md, and you read it back and confirmed. Respond ONLY with this JSON: {"checks":[{"id":"memory-conversational","pass":true,"detail":"Conversational round-trip completed — <brief description of what was written>"}]} — set pass to false only if you did not do this.',
                  failHint:
                    'Go back to Phase 1 and complete the conversational round-trip: tell your Claw a fact ("chuck that in memory: I prefer terse responses"), confirm it writes to the file, then read the file back.',
                  fixPrompt:
                    'Tell your Claw a new fact about yourself ("chuck that in memory: <fact>"), confirm it wrote it to USER.md or MEMORY.md, then re-run this step.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
