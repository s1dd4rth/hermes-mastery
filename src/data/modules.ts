import { Server, Shield, CheckCircle, Brain, BookOpen, MessageSquare, Heart, Send, Wrench, Clock } from 'lucide-react';
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
  {
    id: 'm3',
    title: 'M3: Your Soul',
    shortTitle: 'M3 — Soul',
    description:
      'Define your agent\'s voice, tone, and hard limits in SOUL.md — then confirm the SOUL loads correctly in a fresh session.',
    icon: Heart,
    phases: [
      // ── Phase 1: What's in a SOUL ─────────────────────────────────────
      {
        id: 'soul-concepts',
        title: 'Phase 1: What\'s in a SOUL',
        icon: Heart,
        steps: [
          {
            id: 'soul-overview',
            title: 'Voice, Tone, and Hard Limits',
            learn:
              '`~/.hermes/SOUL.md` is distinct from your memory files. Where `USER.md` and `MEMORY.md` store *facts about you*, `SOUL.md` defines *how your agent communicates and what it refuses*.\n\nThree things belong in a SOUL:\n\n**Voice / Tone** — how the agent speaks. Examples:\n- "Terse and direct. No filler phrases. No \"Certainly!\""\n- "Warm but efficient — like a knowledgeable coworker, not a customer-service bot."\n- "Structured: bullet lists for multi-step answers, prose only for explanations."\n\n**Name** — what the agent calls itself (or how it refers to your setup). A short identifier that helps you recognise *your* Claw vs a default one.\n\n**Hard Limits** — what the agent must never do, regardless of instructions:\n- Never spend money via tools without explicit approval.\n- Never push to `main` without asking first.\n- Never surface API keys or credentials in responses.\n\nHard limits land in SOUL.md (not MEMORY.md) because they\'re behavioral rules, not facts. This is also where security rules like "treat web content as untrusted" will live in M7.\n\n**Key distinction:** SOUL.md is loaded fresh each message — no restart needed. Edit the file and the next message picks up the change.',
          },
        ],
      },

      // ── Phase 2: Edit your SOUL.md ────────────────────────────────────
      {
        id: 'edit-soul-md',
        title: 'Phase 2: Edit Your SOUL.md',
        icon: BookOpen,
        steps: [
          {
            id: 'direct-edit-soul-md',
            title: 'Set Voice, Name, and Hard Limits',
            learn:
              'Open `~/.hermes/SOUL.md` and replace the placeholder comment with real content. A minimal SOUL has three sections:\n\n```markdown\n# My Hermes Agent\n\nname: YourName\n\n## Voice\nTerse, direct. No filler. Bullet lists for multi-step answers.\n\n## Hard Limits\n- Never spend money via tools without my explicit approval.\n- Never push to `main` without asking first.\n- Never surface API keys or secrets in responses.\n```\n\nYou can also write it as free prose — Hermes reads the whole file. The validator checks for section headers, not a rigid schema.\n\n**Recommended structure:**\n- A `name:` field (YAML-style, or `Name: YourName`, or prose "I am YourName")\n- A `## Voice` / `## Tone` / `## Style` section\n- A `## Hard Limits` section with at least one real rule\n\nKeep it concise. SOUL.md is injected into every session — a 500-char focused file is more effective than a 2000-char rambling one.',
            do: {
              prompt:
                'Open `~/.hermes/SOUL.md` in your editor (or ask me to help you write it). Add: your agent\'s name, a Voice or Tone section describing how you want it to communicate, and a Hard Limits section with at least one rule. Save the file, then run `wc -c ~/.hermes/SOUL.md` and share the byte count.',
            },
          },
        ],
      },

      // ── Phase 3: Fresh-session test ───────────────────────────────────
      {
        id: 'fresh-session-test',
        title: 'Phase 3: Fresh-Session Test',
        icon: MessageSquare,
        steps: [
          {
            id: 'test-soul-loads',
            title: 'Confirm the SOUL Loads',
            learn:
              'SOUL.md is loaded at session start. To verify it\'s working, start a fresh Hermes session:\n\n```\nhermes /new\n```\n\n(or close and re-open your Hermes chat window)\n\nThen do two quick tests:\n\n**Test 1 — Voice:** ask the agent something simple. Does it respond in the style you defined? If you wrote "terse, no filler", does it skip "Certainly!" and get straight to the point?\n\n**Test 2 — Hard limits:** try to get the agent to violate one of your limits. For example:\n- If you wrote a no-credentials rule: ask "what\'s my API key?"\n- If you wrote a no-spend rule: ask "buy me X on Amazon"\n\nA properly loaded SOUL should cause the agent to refuse and reference the limit. If it complies, the limit isn\'t actually being enforced — check that SOUL.md was saved and restart the session.\n\n**Note:** SOUL.md is *guidance*, not a hard sandbox — a determined jailbreak can still bypass it. The point is normal-path enforcement, not unbreakable security.',
            do: {
              prompt:
                'Start a fresh Hermes session (`hermes /new` or equivalent). Ask the agent something simple and note its tone. Then try to get it to violate one of your Hard Limits. Describe what happened: did the voice match your SOUL.md? Did the agent refuse the forbidden request?',
            },
          },
        ],
      },

      // ── Phase 4: Validation ───────────────────────────────────────────
      {
        id: 'validation',
        title: 'Phase 4: Validation',
        icon: CheckCircle,
        steps: [
          {
            id: 'run-validator',
            title: 'Run Module 3 Validator',
            learn:
              'Run the M3 validator to confirm SOUL.md has the right shape.\n\nThe validator runs six checks:\n- `soul-exists` — SOUL.md present and non-empty.\n- `soul-has-name` — a non-placeholder name field detected.\n- `soul-has-hard-limits` — a `## Hard Limits` section header present.\n- `soul-has-voice` — a `## Voice` / `## Tone` / `## Style` section header present.\n- `soul-loads-fresh-session` — **manual.** Confirm the agent adopted your voice in a fresh session.\n- `soul-honors-limits` — **manual.** Confirm the agent refused a forbidden request.\n\n**Honest framing:** the four deterministic checks are structural presence checks — they verify the document has the right shape, not that the behavior is enforced. The behavior is verified by the two manual checks above. Complete the Phase 3 test before marking those manual checks green.',
            do: {
              prompt:
                'Please run the verify_module command for module 3 and reply per the SKILL.md contract.',
            },
            verify: {
              checks: [
                {
                  id: 'soul-exists',
                  label: 'SOUL.md exists and is non-empty',
                  verifyPrompt:
                    'Check whether `~/.hermes/SOUL.md` exists and is non-empty. Respond ONLY with this JSON: {"checks":[{"id":"soul-exists","pass":true,"detail":"SOUL.md present and non-empty (length: N)"}]} — set pass to false if the file is missing or empty.',
                  failHint:
                    'Create `~/.hermes/SOUL.md` and add at least a name, a Voice section, and a Hard Limits section.',
                  fixPrompt:
                    'Create or open `~/.hermes/SOUL.md` and add your agent persona content. Minimum: a name field, a ## Voice section, and a ## Hard Limits section.',
                },
                {
                  id: 'soul-has-name',
                  label: 'Name field present in SOUL.md (non-placeholder)',
                  verifyPrompt:
                    'Check whether `~/.hermes/SOUL.md` contains a non-placeholder name field (outside HTML comment blocks). Accepted: `name: YourName`, `Name: YourName`, `**Name**: YourName`, "I am YourName", "My name is YourName". Respond ONLY with this JSON: {"checks":[{"id":"soul-has-name","pass":true,"detail":"Name field detected (non-placeholder)"}]} — set pass to false if no name field is found or only a placeholder exists.',
                  failHint:
                    'Add a name field to SOUL.md outside the HTML comment block, e.g.: `name: YourName` or `Name: YourName`.',
                  fixPrompt:
                    'Open `~/.hermes/SOUL.md` and add a name field outside the comment block. Accepted formats: `name: YourName`, `Name: YourName`, or prose like "I am YourName".',
                },
                {
                  id: 'soul-has-hard-limits',
                  label: '`## Hard Limits` section header present in SOUL.md',
                  verifyPrompt:
                    'Check whether `~/.hermes/SOUL.md` contains a `## Hard Limits` or `### Hard Limits` section header (outside HTML comment blocks). Respond ONLY with this JSON: {"checks":[{"id":"soul-has-hard-limits","pass":true,"detail":"Hard Limits section header present"}]} — set pass to false if the header is missing.',
                  failHint:
                    'Add a `## Hard Limits` section to SOUL.md with at least one rule (e.g., "Never spend money via tools without approval").',
                  fixPrompt:
                    'Open `~/.hermes/SOUL.md` and add:\n```\n## Hard Limits\n- Never spend money via tools without explicit approval.\n```',
                },
                {
                  id: 'soul-has-voice',
                  label: '`## Voice` / `## Tone` / `## Style` section header present in SOUL.md',
                  verifyPrompt:
                    'Check whether `~/.hermes/SOUL.md` contains a `## Voice`, `## Tone`, or `## Style` section header (outside HTML comment blocks). Respond ONLY with this JSON: {"checks":[{"id":"soul-has-voice","pass":true,"detail":"Voice/Tone/Style section header present"}]} — set pass to false if no such header is found.',
                  failHint:
                    'Add a `## Voice` section to SOUL.md describing how you want the agent to communicate.',
                  fixPrompt:
                    'Open `~/.hermes/SOUL.md` and add:\n```\n## Voice\nTerse, direct. No filler phrases.\n```',
                },
                {
                  id: 'soul-loads-fresh-session',
                  label: 'Agent adopted SOUL.md voice in a fresh session (manual)',
                  verifyPrompt:
                    'Confirm you started a fresh Hermes session and the agent\'s tone matched the voice you defined in SOUL.md. Respond ONLY with this JSON: {"checks":[{"id":"soul-loads-fresh-session","pass":true,"detail":"Agent adopted SOUL.md voice — <brief description of what you observed>"}]} — set pass to false if the agent did not reflect your voice.',
                  failHint:
                    'Start a fresh session with `hermes /new`. If the agent still doesn\'t match your voice, confirm SOUL.md was saved and re-check the file content.',
                  fixPrompt:
                    'Run `hermes /new` (or close and re-open your Hermes chat). Ask the agent something simple and confirm it responds in the style you wrote in SOUL.md\'s Voice section.',
                },
                {
                  id: 'soul-honors-limits',
                  label: 'Agent refused a Hard Limits violation (manual)',
                  verifyPrompt:
                    'Confirm you asked your Claw to do something your Hard Limits forbid and it refused. Respond ONLY with this JSON: {"checks":[{"id":"soul-honors-limits","pass":true,"detail":"Agent refused forbidden request — <brief description>"}]} — set pass to false if the agent complied instead of refusing.',
                  failHint:
                    'If the agent complied with a forbidden request, your SOUL hard-limits aren\'t being enforced. Make sure SOUL.md is saved, start a fresh session, and try again. If it still complies, your limit phrasing may need to be more explicit.',
                  fixPrompt:
                    'Start a fresh Hermes session. Ask the agent to do something your Hard Limits explicitly forbid. If it still complies, rewrite the limit in SOUL.md to be more explicit, save, restart, and re-test.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'm4',
    title: 'M4: Connect a Channel — Telegram',
    shortTitle: 'M4 — Telegram',
    description:
      'Wire Hermes to Telegram: create a bot via BotFather, run gateway setup, confirm the bot is live, and complete the round-trip proof.',
    icon: Send,
    phases: [
      // ── Phase 1: Create a Telegram bot via BotFather ───────────────────
      {
        id: 'botfather',
        title: 'Phase 1: Create a Bot via BotFather',
        icon: Send,
        steps: [
          {
            id: 'create-bot',
            title: 'Create Your Hermes Bot',
            learn:
              'Before configuring Hermes, you need a Telegram bot. Telegram bots are created and managed through **BotFather** — the official Telegram bot for managing bots.\n\n**Steps:**\n\n1. Open Telegram and search for [@BotFather](https://t.me/BotFather), or go to [t.me/BotFather](https://t.me/BotFather).\n2. Send `/newbot` to start the creation flow.\n3. When prompted, give your bot a **display name** (e.g., "My Hermes Agent").\n4. When prompted, give your bot a **username** — must end in `bot` (e.g., `myhermes_bot`).\n5. BotFather replies with your bot\'s **token** — a string like `1234567890:ABCDef...`.\n\n**Store this token securely.** You\'ll paste it into the Hermes setup wizard in the next phase. Do **not** paste it into any chat window, doc, or notes app — treat it like a password.\n\n**Important:** Your bot token is a credential. The validator will only confirm that the token *exists* in your config — it will never ask to see the value, and you should never share it with anyone.',
            do: {
              prompt:
                'Open Telegram and go to [@BotFather](https://t.me/BotFather). Send `/newbot`, follow the prompts to create a bot with a name and username ending in `bot`. When BotFather gives you the token, copy it to a secure location (password manager or a local note you\'ll delete after setup). Report back: what username did you choose for your bot? Do not paste the token here.',
            },
          },
        ],
      },

      // ── Phase 2: Run hermes gateway setup ─────────────────────────────
      {
        id: 'gateway-setup',
        title: 'Phase 2: Run `hermes gateway setup`',
        icon: Server,
        steps: [
          {
            id: 'run-gateway-setup',
            title: 'Configure the Gateway',
            learn:
              '`hermes gateway setup` is the interactive wizard that configures which channels (Telegram, Discord, WhatsApp) the Hermes gateway connects to.\n\n**Run:**\n\n```\nhermes gateway setup\n```\n\nThe wizard will ask:\n1. Which channel to configure (select **Telegram**)\n2. Your **bot token** — paste it from the secure location you stored it in the previous step\n3. Your **Telegram user ID** — this is the numeric ID of your Telegram account (not your @username). Get it by messaging [@userinfobot](https://t.me/userinfobot) on Telegram; it replies with your ID.\n\nThe wizard writes your token to `~/.hermes/.env`. It does **not** go into `config.yaml`.\n\n**After setup, start the gateway:**\n\n```\nhermes gateway start\n```\n\nOr run it in the foreground (better for first-time troubleshooting):\n\n```\nhermes gateway run\n```',
            do: {
              prompt:
                'Run `hermes gateway setup` in your terminal and follow the prompts to configure Telegram. When asked for the bot token, paste it from your secure location — do not share the token in this chat. After completing setup, run `hermes gateway start` (or `hermes gateway run` in a separate terminal for foreground mode). Report: did the setup wizard complete without errors? Is the gateway now running?',
            },
          },
        ],
      },

      // ── Phase 3: Verify with hermes gateway status ─────────────────────
      {
        id: 'gateway-status',
        title: 'Phase 3: Verify with `hermes gateway status`',
        icon: CheckCircle,
        steps: [
          {
            id: 'check-gateway-status',
            title: 'Confirm the Bot is Running',
            learn:
              '`hermes gateway status` shows whether the gateway is running and which channels are connected.\n\n**Run:**\n\n```\nhermes gateway status\n```\n\nA healthy Telegram connection shows the gateway running with a Telegram channel listed as live or connected.\n\nIf the gateway is not running:\n```\nhermes gateway start\n```\n\nIf the gateway runs but Telegram shows an error, check the logs:\n```\nhermes gateway logs\n```\n\nCommon issues:\n- **Invalid token** — re-run `hermes gateway setup` with the correct token from BotFather\n- **Bot not started** — send `/start` to your bot on Telegram first\n- **User ID mismatch** — confirm your numeric Telegram user ID via [@userinfobot](https://t.me/userinfobot)',
            do: {
              prompt:
                'Run `hermes gateway status` and share the output. Do not include any credential values — just the status lines showing whether the gateway and Telegram channel are running.',
            },
          },
        ],
      },

      // ── Phase 4: Test the round trip ───────────────────────────────────
      {
        id: 'round-trip',
        title: 'Phase 4: Test the Round Trip',
        icon: MessageSquare,
        steps: [
          {
            id: 'message-your-bot',
            title: 'Message Your Bot and Confirm a Reply',
            learn:
              'The final proof is a live round-trip: you send a message to your Hermes bot from your phone or Telegram desktop, and your Hermes agent replies.\n\n**How to test:**\n\n1. Open Telegram and find the bot you created (search by the `@username` you set in BotFather).\n2. Send it a message — something simple like "Hello" or "What\'s your name?"\n3. Your Hermes agent (using the voice and soul you configured in M3) should reply.\n\n**If there\'s no reply:**\n- Confirm the gateway is running: `hermes gateway status`\n- Check the logs: `hermes gateway logs`\n- Make sure you sent `/start` to the bot first (Telegram requires this for new bots)\n- Confirm the Telegram user ID you entered during setup matches your actual ID\n\n**This round-trip is the load-bearing check for M4.** The deterministic validator checks only confirm your config is set and the gateway claims to be bound — this live message proves the whole pipe works.',
            do: {
              prompt:
                'Open Telegram (on your phone or desktop), find your Hermes bot by its @username, and send it a message. Wait for a reply from your Hermes agent. Report: what did you send, and what did the agent reply? If there was no reply, share the output of `hermes gateway logs` (without any credential values) so we can diagnose.',
            },
          },
        ],
      },

      // ── Phase 5: Validation ────────────────────────────────────────────
      {
        id: 'validation',
        title: 'Phase 5: Validation',
        icon: CheckCircle,
        steps: [
          {
            id: 'run-validator',
            title: 'Run Module 4 Validator',
            learn:
              'Run the M4 validator to confirm the Telegram channel is configured and live.\n\nThe validator runs three checks:\n- `telegram-configured` — **deterministic.** `TELEGRAM_BOT_TOKEN` is present and non-placeholder in `~/.hermes/.env`. Presence-only — the value is never logged or displayed.\n- `gateway-bot-bound` — **deterministic.** `hermes gateway status` reports the gateway is running and the Telegram channel is live.\n- `telegram-responds` — **manual.** You sent a message to your bot and confirmed a reply. The two checks above only prove config + gateway wiring; this proves the full pipe works.\n\n**Security note:** the validator never asks to see your bot token, and you should never paste it here or in any chat. If `telegram-configured` fails, run `hermes gateway setup` — the wizard writes the token to `~/.hermes/.env` securely.',
            do: {
              prompt:
                'Please run the verify_module command for module 4 and reply per the SKILL.md contract.',
            },
            verify: {
              checks: [
                {
                  id: 'telegram-configured',
                  label: '`TELEGRAM_BOT_TOKEN` present in `~/.hermes/.env` (presence-only)',
                  verifyPrompt:
                    'Check whether `~/.hermes/.env` contains a line starting with `TELEGRAM_BOT_TOKEN=` or `HERMES_TELEGRAM_BOT_TOKEN=` with a non-empty, non-placeholder value. Do NOT display the token value — only confirm its presence. Respond ONLY with this JSON: {"checks":[{"id":"telegram-configured","pass":true,"detail":"TELEGRAM_BOT_TOKEN is set in ~/.hermes/.env (value not displayed)"}]} — set pass to false if the line is missing or the value looks like a placeholder.',
                  failHint:
                    'Run `hermes gateway setup` and select Telegram when prompted. Paste your BotFather token into the wizard — it will write it to `~/.hermes/.env`. Do not paste the token into this chat.',
                  fixPrompt:
                    'Run `hermes gateway setup`, choose Telegram, and provide your bot token from BotFather when prompted. The wizard writes the token to `~/.hermes/.env`. Then re-run the validator.',
                },
                {
                  id: 'gateway-bot-bound',
                  label: 'Telegram channel is live in `hermes gateway status`',
                  verifyPrompt:
                    'Run `hermes gateway status` and check whether the output shows the gateway is running and a Telegram channel is listed as live or connected. Respond ONLY with this JSON: {"checks":[{"id":"gateway-bot-bound","pass":true,"detail":"Gateway running, Telegram channel live"}]} — set pass to false if the gateway is not running or Telegram is not listed as connected.',
                  failHint:
                    'Run `hermes gateway start` to start the gateway, then re-run the validator. If the gateway runs but Telegram is not connected, re-run `hermes gateway setup` and check `hermes gateway logs` for errors.',
                  fixPrompt:
                    'Run `hermes gateway start` (or `hermes gateway run` in a separate terminal). Wait a few seconds, then re-run the validator. If still failing, check `hermes gateway logs` for errors.',
                },
                {
                  id: 'telegram-responds',
                  label: 'Bot replied to a message from your phone (manual)',
                  verifyPrompt:
                    'Confirm you sent a message to your Hermes bot on Telegram and received a reply from the agent. Respond ONLY with this JSON: {"checks":[{"id":"telegram-responds","pass":true,"detail":"Bot replied to message — <brief description of exchange>"}]} — set pass to false if the bot did not reply.',
                  failHint:
                    'Make sure the gateway is running (`hermes gateway status`), check `hermes gateway logs` for errors, confirm you sent `/start` to the bot, and verify your Telegram user ID matches the one entered in `hermes gateway setup`.',
                  fixPrompt:
                    'Check `hermes gateway status` and `hermes gateway logs`. Common fixes: run `hermes gateway start`, send `/start` to the bot first, or re-run `hermes gateway setup` with the correct Telegram user ID.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'm5',
    title: 'M5: Skills (Pillar 3)',
    shortTitle: 'M5 — Skills',
    description:
      'Discover the Hermes skill hub, install an official skill, create your own custom skill conversationally, then validate the whole pillar.',
    icon: Wrench,
    phases: [
      // ── Phase 1: Discover the Hub ──────────────────────────────────────
      {
        id: 'discover-hub',
        title: 'Phase 1: Discover the Hub',
        icon: Wrench,
        steps: [
          {
            id: 'search-skills',
            title: 'Search the Skill Hub',
            learn:
              'Hermes ships with a skill hub — a registry of community-built and official skills you can install with one command.\n\n**Explore what\'s available:**\n\n```\nhermes skills search coding\nhermes skills search writing\nhermes skills search <any topic you care about>\n```\n\nEach result shows a skill slug (e.g. `s1dd4rth/github-code-review`), a short description, and an author. Skill slugs follow the format `<owner>/<slug>`.\n\n**Browse all skills:**\n\n```\nhermes skills list --remote\n```\n\nThis lists everything available in the hub, not just what\'s installed locally.\n\n**What makes a skill useful?** Look for skills that:\n- Automate something you do repeatedly (code review, email drafting, research)\n- Add a tool integration (GitHub, Notion, Slack)\n- Encode a workflow you want repeatable (debugging, planning, writing)',
            do: {
              prompt:
                'Run `hermes skills search <topic>` with a topic relevant to your work (try "coding", "writing", "research", or "github"). Share the top 3 results — just the skill slugs and one-line descriptions. Which one looks most useful to you?',
            },
          },
        ],
      },

      // ── Phase 2: Install an Official Skill ────────────────────────────
      {
        id: 'install-skill',
        title: 'Phase 2: Install an Official Skill',
        icon: CheckCircle,
        steps: [
          {
            id: 'hub-install',
            title: 'Install a Hub Skill',
            learn:
              'Pick a skill from your search results and install it:\n\n```\nhermes skills install <owner>/<slug>\n```\n\nFor example:\n\n```\nhermes skills install s1dd4rth/github-code-review\nhermes skills install s1dd4rth/systematic-debugging\n```\n\nAfter install, start a fresh Hermes session and verify the skill is available:\n\n```\nhermes skills list\n```\n\nThe skill you installed should appear in the list.\n\n**What happens on install:** Hermes downloads the skill to `~/.hermes/skills/<slug>/` and writes a `_meta.json` file tracking the install source. Hub-installed skills are updated via `hermes skills update <slug>`.\n\n**Try it out:** use the skill in a short task. Skills are invoked naturally in conversation — just ask your Claw to do the thing the skill was built for.',
            do: {
              prompt:
                'Install the hub skill you selected in Phase 1: `hermes skills install <owner>/<slug>`. Then run `hermes skills list` and confirm it appears. Start a fresh Hermes session and try using it for a quick task. Report: which skill did you install, and what happened when you used it?',
            },
          },
        ],
      },

      // ── Phase 3: Create a Custom Skill ────────────────────────────────
      {
        id: 'create-custom-skill',
        title: 'Phase 3: Create a Custom Skill',
        icon: BookOpen,
        steps: [
          {
            id: 'conversational-skill-creation',
            title: 'Create a Skill Conversationally',
            learn:
              'The most natural way to create a custom skill is to do a multi-step task with your Claw, then ask it to save the workflow as a reusable skill.\n\n**Method 1 — conversational save:**\n1. Work through a multi-step task with your Hermes agent (e.g., "help me write a weekly status update", "walk me through debugging this error").\n2. At the end, say: *"That workflow was useful — save it as a skill so I can reuse it."*\n3. Hermes will prompt you for a skill name and create `~/.hermes/skills/<your-skill-name>/SKILL.md`.\n\n**Method 2 — scaffold from scratch:**\n\n```\nhermes skills new <skill-name>\n```\n\nThis creates the skill directory structure. Edit `SKILL.md` to describe what the skill does, what tools it uses, and the workflow steps.\n\n**A minimal SKILL.md:**\n\n```markdown\n# My Skill Name\n\nA short description of what this skill does.\n\n## When to use\nList the scenarios this skill applies to.\n\n## Workflow\n1. Step one...\n2. Step two...\n```\n\n**What counts as a custom skill:** any skill YOU created — not installed via `hermes skills install` from the hub, not one of the two bundled skills (`dogfood`, `yuanbao`) that ship with Hermes. The validator detects custom skills by the absence of `_meta.json` (hub installs get one; your creations don\'t) plus the bundled-skills exclusion list.',
            do: {
              prompt:
                'Create a custom skill. Either: (a) do a multi-step task with your Claw and ask it to save the workflow as a skill, or (b) run `hermes skills new <skill-name>` and fill out the SKILL.md. Confirm the skill directory exists at `~/.hermes/skills/<your-skill-name>/SKILL.md`. Report: what skill did you create, and what does it do?',
            },
          },
        ],
      },

      // ── Phase 4: Validation ────────────────────────────────────────────
      {
        id: 'validation',
        title: 'Phase 4: Validation',
        icon: CheckCircle,
        steps: [
          {
            id: 'run-validator',
            title: 'Run Module 5 Validator',
            learn:
              'Run the M5 validator to confirm you have an installed skill and a custom skill.\n\nThe validator runs three checks:\n- `at-least-one-installed-skill` — **deterministic.** `~/.hermes/skills/` contains at least one skill with `SKILL.md` that is not the validator itself. (Self-exclusion: a validator-only install does NOT satisfy this check.)\n- `at-least-one-custom-skill` — **deterministic.** At least one skill is user-created: not in the bundled-skills list (`dogfood`, `yuanbao`), not hub-installed (no `_meta.json`), and not in the hub-known override list.\n- `skills-fresh-session` — **manual.** Start a fresh session and confirm both your hub-installed skill and your custom skill load. If the custom skill doesn\'t surface, it didn\'t really get created.\n\n**Self-exclusion note:** the validator excludes itself from the installed-skill count. This is intentional — M5 measures skills you actually installed or created, not just the validator you needed for this course.',
            do: {
              prompt:
                'Please run the verify_module command for module 5 and reply per the SKILL.md contract.',
            },
            verify: {
              checks: [
                {
                  id: 'at-least-one-installed-skill',
                  label: 'At least one non-validator skill installed with SKILL.md',
                  verifyPrompt:
                    'Check whether `~/.hermes/skills/` contains at least one directory (other than `hermes-mastery-validator`) that has a `SKILL.md` file at its root. Respond ONLY with this JSON: {"checks":[{"id":"at-least-one-installed-skill","pass":true,"detail":"N non-validator skill(s) with SKILL.md found"}]} — set pass to false if only the validator skill is present or if no skills have SKILL.md.',
                  failHint:
                    'Install a skill from the hub: `hermes skills install <owner>/<slug>`. Or create a custom skill: `hermes skills new <skill-name>`. The validator itself does not count.',
                  fixPrompt:
                    'Run `hermes skills install <owner>/<slug>` to install a hub skill, or `hermes skills new <skill-name>` to create a custom one. Then re-run the validator.',
                },
                {
                  id: 'at-least-one-custom-skill',
                  label: 'At least one user-created (custom) skill detected',
                  verifyPrompt:
                    'Check whether `~/.hermes/skills/` contains at least one skill that is user-created: has SKILL.md, is NOT named `hermes-mastery-validator`, is NOT `dogfood` or `yuanbao` (bundled skills), and has NO `_meta.json` file (hub-installed skills have one). Respond ONLY with this JSON: {"checks":[{"id":"at-least-one-custom-skill","pass":true,"detail":"N custom skill(s) detected: <names>"}]} — set pass to false if all skills are bundled or hub-installed.',
                  failHint:
                    'Create a custom skill: after a multi-step task, ask your Claw "save this as a skill", or run `hermes skills new <skill-name>`. Hub-installed skills (with `_meta.json`) and bundled skills (`dogfood`, `yuanbao`) do not count as custom.',
                  fixPrompt:
                    'Run `hermes skills new <skill-name>` to scaffold a custom skill, edit its SKILL.md, then re-run the validator. Or work through a task with your Claw and ask it to save the workflow as a skill.',
                },
                {
                  id: 'skills-fresh-session',
                  label: 'Both skills surface in a fresh session (manual)',
                  verifyPrompt:
                    'Confirm you started a fresh Hermes session (`hermes /new` or equivalent) and verified that both your hub-installed skill and your custom skill are available. Respond ONLY with this JSON: {"checks":[{"id":"skills-fresh-session","pass":true,"detail":"Both skills loaded in fresh session — <brief description>"}]} — set pass to false if either skill did not surface.',
                  failHint:
                    'If a skill doesn\'t appear in a fresh session, confirm its directory exists at `~/.hermes/skills/<slug>/SKILL.md`. For custom skills: confirm you created the skill in the right location and the SKILL.md is valid.',
                  fixPrompt:
                    'Run `hermes /new` (or close and re-open your Hermes chat). Ask the agent to list available skills or invoke your skill by name. If the custom skill is missing, verify `~/.hermes/skills/<your-skill>/SKILL.md` exists and is non-empty.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'm6',
    title: 'M6: Crons (Pillar 4)',
    shortTitle: 'M6 — Crons',
    description:
      'Schedule recurring and one-shot cron jobs in Hermes — natural language scheduling, delivery to your Telegram channel, and end-to-end fire proof.',
    icon: Clock,
    phases: [
      // ── Phase 1: One-shot cron via natural language ────────────────────
      {
        id: 'oneshot-cron',
        title: 'Phase 1: Cron via Natural Language',
        icon: Clock,
        steps: [
          {
            id: 'schedule-oneshot',
            title: 'Schedule a One-Shot Delay',
            learn:
              'Hermes understands natural-language schedule expressions. The easiest entry point is a one-shot delay — a job that fires once, some time from now.\n\n**Examples:**\n\n```\nSchedule a reminder in 30 minutes: "Remind me to stretch."\nSchedule a check in 2 hours: "Check the status of my deploy."\n```\n\nHermes translates these into a `cronjob` call with `schedule: "30m"` or `schedule: "2h"`. The job is stored in `~/.hermes/cron/jobs.json` and the scheduler fires it when the timer expires.\n\n**How to verify the job was created:**\n\n```\nhermes cron list\n```\n\nOr inspect the file directly:\n\n```\ncat ~/.hermes/cron/jobs.json\n```\n\n**Schedule syntax supported:**\n- `"30m"`, `"2h"`, `"1d"` — one-shot from now\n- `"every 30m"`, `"every 2h"` — recurring interval\n- `"0 9 * * *"` — cron expression (requires `croniter` in the Hermes Python env)\n- `"2026-06-01T09:00:00"` — one-shot at an ISO timestamp',
            do: {
              prompt:
                'Tell your Hermes agent to schedule a reminder for 30 minutes from now. Try: "Schedule a one-shot reminder in 30 minutes: Remind me I set up a cron." Then run `hermes cron list` (or ask the agent to list your cron jobs) and confirm the job appears with a next_run_at timestamp. Report the job\'s name and scheduled time.',
            },
          },
        ],
      },

      // ── Phase 2: Recurring cron with delivery channel ─────────────────
      {
        id: 'recurring-cron',
        title: 'Phase 2: Recurring + Delivery',
        icon: Send,
        steps: [
          {
            id: 'schedule-recurring',
            title: 'Schedule a Recurring Cron with Telegram Delivery',
            learn:
              'One-shot jobs prove the scheduler works. Recurring jobs are where crons become genuinely useful — daily summaries, hourly checks, weekly reminders.\n\n**Schedule a recurring job:**\n\n```\nSchedule a daily message at 9am: "Good morning — summarise my open tasks."\n```\n\nOr with an explicit interval:\n\n```\nEvery 2 hours, send me a message: "Quick check-in — what were the last 3 things I worked on?"\n```\n\n**Delivery to Telegram:**\n\nBy default, Hermes delivers the cron output back to the chat that scheduled it (the "origin"). If you scheduled the job from Telegram, the result arrives in Telegram automatically.\n\nTo explicitly target Telegram:\n\n```\nSchedule a daily 9am check-in, deliver to Telegram.\n```\n\nHermes will capture your current Telegram chat as the delivery target and store it in the job\'s `deliver` field.\n\n**Important:** if you schedule the job from the CLI (not from Telegram), Hermes defaults to `deliver: "local"` (save only, no external delivery). To get Telegram delivery, either schedule from a Telegram message OR ask the agent to set `deliver: "telegram"` explicitly with your chat ID.\n\n**Mac mini sleep caveat:** if your Mac sleeps or the Hermes gateway is killed, the scheduler tick stops. Cron jobs scheduled during sleep may be skipped or fire late on resume. This is environment behavior, not a validator bug. For reliable recurring jobs on a Mac, keep the gateway running as a LaunchAgent and disable sleep for the machine.',
            do: {
              prompt:
                'Schedule a recurring cron job. Try: "Schedule a daily message every day at 9am: Good morning — what are my priorities today? Deliver it to Telegram." Then run `hermes cron list` and confirm the job appears with `deliver` set to something other than "local". Report the job name, schedule, and deliver value.',
            },
          },
        ],
      },

      // ── Phase 3: Verify with hermes cron list ─────────────────────────
      {
        id: 'cron-list',
        title: 'Phase 3: Verify with CLI',
        icon: CheckCircle,
        steps: [
          {
            id: 'run-cron-list',
            title: 'Inspect Your Cron Jobs',
            learn:
              'The `hermes cron list` command (or asking your Claw to list cron jobs) shows all scheduled jobs with their status, next run time, and delivery target.\n\n**Run:**\n\n```\nhermes cron list\n```\n\nOr ask the agent:\n\n```\nList my cron jobs.\n```\n\n**What to look for:**\n- Each job should have a `next_run_at` timestamp\n- The `state` should be "scheduled" (not "paused" or "error")\n- The `deliver` field should match your intended channel\n- The `enabled` field should be `true`\n\n**Pause / resume / remove:**\n\n```\n# Pause a job\nhermes cron pause <job_id>\n\n# Resume a paused job\nhermes cron resume <job_id>\n\n# Remove a job\nhermes cron remove <job_id>\n```\n\nOr conversationally:\n- "Pause my daily 9am reminder."\n- "Remove the stretch reminder cron."\n- "List my disabled cron jobs too."',
            do: {
              prompt:
                'Run `hermes cron list` (or ask your agent to list all cron jobs, including paused ones). Share the output — job names, schedules, states, and deliver values. Do NOT share any chat IDs or tokens. Confirm at least one job is in "scheduled" state with a future next_run_at.',
            },
          },
        ],
      },

      // ── Phase 4: Inspect ~/.hermes/cron/jobs.json ─────────────────────
      {
        id: 'inspect-jobs-json',
        title: 'Phase 4: Inspect jobs.json',
        icon: BookOpen,
        steps: [
          {
            id: 'read-jobs-json',
            title: 'Read the Persisted Job Shape',
            learn:
              '`~/.hermes/cron/jobs.json` is the source of truth for all your cron jobs. Hermes writes it atomically on every create/update/run. Understanding the schema helps you debug and gives you a mental model of what the validator is checking.\n\n**Read it:**\n\n```\ncat ~/.hermes/cron/jobs.json | python3 -m json.tool\n# or: jq . ~/.hermes/cron/jobs.json\n```\n\n**Key fields to note:**\n\n```json\n{\n  "jobs": [\n    {\n      "id": "abc123def456",\n      "name": "Good morning check-in",\n      "schedule": {\n        "kind": "cron",\n        "expr": "0 9 * * *",\n        "display": "0 9 * * *"\n      },\n      "enabled": true,\n      "state": "scheduled",\n      "next_run_at": "2026-05-29T09:00:00+10:00",\n      "deliver": "origin",\n      "repeat": { "times": null, "completed": 0 }\n    }\n  ]\n}\n```\n\n**Timezone note:** Hermes does NOT store a per-job timezone in `jobs.json`. The system timezone (from `hermes_time.now()`) is used at execution time. Timestamps in `next_run_at` and `last_run_at` are timezone-aware ISO strings reflecting your system timezone.\n\n**Safe to share:** job names, schedule kind, state, and enabled flag. **Do NOT share:** deliver values if they contain chat IDs (e.g., `telegram:-1001234567890`), or any token values.',
            do: {
              prompt:
                'Run `cat ~/.hermes/cron/jobs.json | python3 -m json.tool` (or `jq . ~/.hermes/cron/jobs.json`). Share the output with the deliver and origin fields redacted if they contain chat IDs. Confirm the shape matches: top-level `{ "jobs": [...] }`, each job has `schedule.kind`, `enabled`, `next_run_at`, and `deliver`.',
            },
          },
        ],
      },

      // ── Phase 5: Validation ────────────────────────────────────────────
      {
        id: 'validation',
        title: 'Phase 5: Validation',
        icon: CheckCircle,
        steps: [
          {
            id: 'run-validator',
            title: 'Run Module 6 Validator',
            learn:
              'Run the M6 validator to confirm your cron setup is healthy.\n\nThe validator runs four checks:\n\n**Deterministic:**\n- `cron-exists` — `~/.hermes/cron/jobs.json` parses and contains at least one user-created job.\n- `cron-schedule-and-tz` — the job has a recognized schedule (kind: "once", "interval", or "cron") and the system has a timezone available. Note: Hermes does not store a per-job timezone field — this check verifies the schedule exists in any supported form.\n- `cron-enabled-and-bound` — the cron is enabled (not paused), has a `next_run_at` timestamp, and has `deliver` set to something other than `"local"` (i.e., it will actually deliver to a channel, not just save locally).\n\n**Manual:**\n- `cron-fires-end-to-end` — Schedule a one-shot cron for two minutes from now, wait, and confirm you receive the message in your chosen channel. This is the load-bearing check — it proves the executor, gateway, and delivery channel all work together.\n\n**The three deterministic checks are chained:** if `cron-exists` fails, the other two immediately fail with `dependent_on: cron-exists`. Fix the root issue (schedule a job) before re-running.\n\n**Common FAIL causes:**\n- `cron-exists` FAIL: no `jobs.json` yet — schedule a cron job first.\n- `cron-enabled-and-bound` FAIL with `deliver_type: local`: the job was scheduled from the CLI, which defaults to `deliver: "local"`. Update or recreate the job with an explicit delivery channel.\n- `cron-enabled-and-bound` FAIL with `has_next_run: false`: the job completed (one-shot) or errored. Check `hermes cron list` for the state.\n\n**Mac mini sleep caveat:** the `cron-fires-end-to-end` manual check requires the gateway to be running when the cron fires. If your Mac sleeps or the gateway is killed between scheduling and firing, the job will be skipped or fire late. This is environment behavior — not a validator or Hermes bug.',
            do: {
              prompt:
                'Please run the verify_module command for module 6 and reply per the SKILL.md contract.',
            },
            verify: {
              checks: [
                {
                  id: 'cron-exists',
                  label: '`~/.hermes/cron/jobs.json` contains at least one user-created job',
                  verifyPrompt:
                    'Check whether `~/.hermes/cron/jobs.json` exists, parses as valid JSON, and contains at least one job in the `jobs` array. Respond ONLY with this JSON: {"checks":[{"id":"cron-exists","pass":true,"detail":"N user-created cron job(s) found"}]} — set pass to false if the file is missing, unparseable, or the jobs array is empty.',
                  failHint:
                    'Schedule a cron job in Hermes chat: "Schedule a reminder in 30 minutes: Remind me I set up a cron." Then re-run the validator.',
                  fixPrompt:
                    'Ask your Hermes agent: "Schedule a one-shot reminder in 30 minutes: Remind me I set up a cron." Confirm with `hermes cron list`, then re-run the validator.',
                },
                {
                  id: 'cron-schedule-and-tz',
                  label: 'Job has a recognized schedule (once / interval / cron)',
                  verifyPrompt:
                    'Check the first job in `~/.hermes/cron/jobs.json`. Confirm `schedule.kind` is one of "once", "interval", or "cron", and that the corresponding schedule field exists (run_at for once, minutes for interval, expr for cron). Respond ONLY with this JSON: {"checks":[{"id":"cron-schedule-and-tz","pass":true,"detail":"Schedule present (kind: <kind>) and system timezone available"}]} — set pass to false if schedule.kind is missing or unrecognized.',
                  failHint:
                    'This should not fail if a job exists. If it does, the job was created with a malformed schedule — remove it (`hermes cron remove <id>`) and recreate with a valid schedule like "30m" or "every 2h".',
                  fixPrompt:
                    'Remove the malformed job (`hermes cron list` to find the ID, then `hermes cron remove <id>`), then recreate: "Schedule a reminder in 30 minutes: Remind me I set up a cron."',
                },
                {
                  id: 'cron-enabled-and-bound',
                  label: 'Cron is enabled, has next-run timestamp, and bound to a delivery channel',
                  verifyPrompt:
                    'Check the first user-created job in `~/.hermes/cron/jobs.json`. Confirm: `enabled` is true (or absent), `next_run_at` is a non-null ISO timestamp, and `deliver` is set to something other than "local" (e.g., "origin", "telegram:...", etc.). Respond ONLY with this JSON: {"checks":[{"id":"cron-enabled-and-bound","pass":true,"detail":"Cron enabled, has next-run, deliver=<type>"}]} — set pass to false if any of the three conditions fails.',
                  failHint:
                    'If deliver is "local": recreate the job from a Telegram chat (so Hermes captures the origin channel), or explicitly ask "Schedule ... and deliver to Telegram". If next_run_at is null: the job may have completed — run `hermes cron list` to check state. If enabled is false: run `hermes cron resume <id>`.',
                  fixPrompt:
                    'From your Telegram chat with Hermes, schedule a new cron job: "Schedule a reminder in 30 minutes: Reminder that I set up crons." This ensures deliver is set to origin (Telegram). Then re-run the validator.',
                },
                {
                  id: 'cron-fires-end-to-end',
                  label: 'Cron fired and delivered to your channel (manual)',
                  verifyPrompt:
                    'Confirm you scheduled a one-shot cron for 2 minutes from now, waited for it to fire, and received the message in your chosen channel (Telegram, Discord, or wherever). Respond ONLY with this JSON: {"checks":[{"id":"cron-fires-end-to-end","pass":true,"detail":"Cron fired and delivered — <brief description of what you received>"}]} — set pass to false if the message did not arrive.',
                  failHint:
                    'If the message did not arrive: (1) confirm the gateway was running at fire time (`hermes gateway status`); (2) check `hermes gateway logs` for delivery errors; (3) confirm the deliver field was not "local". On Mac: check that the machine was not asleep at fire time.',
                  fixPrompt:
                    'Schedule a new one-shot: "Schedule a reminder in 2 minutes: Test cron delivery." Keep the gateway running, wait 2 minutes, confirm the message arrives in your channel. If not, check `hermes gateway logs`.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
