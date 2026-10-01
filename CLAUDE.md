@AGENTS.md

## Claude Code notes

- `AGENTS.md` above is the shared source of truth for Claude and Codex — edit it,
  not this file, when the rules change.
- Use `/impeccable` for visual design and critique work on the SVGs and README.
- Raster image generation, when one is genuinely needed, is delegated to Codex.
  Brand marks are never generated — copy them from `nayots_branding`.
- On Windows, write files containing backslashes with the Write tool, not a Bash
  heredoc (heredocs halve backslashes on this machine).

<!-- codex-workflow:begin v8 -->
# Claude ↔ Codex workflow

- **Claude** (you): PLANNING and REVIEW. You decide whether, and how, to offload
  implementation to Codex.
- **Codex** (runs its own Superpowers): IMPLEMENTATION, when offloaded.

Codex bills my Codex/ChatGPT plan, not my Claude plan, so the two limits fail
independently — how much that actually saves depends on my subscriptions, so
don't state it as guaranteed. Offloading is OPTIONAL, decided per feature.

## Gate — read `docs/codex-workflow.md` before you delegate

**Before composing a delegation call, polling a job, or reviewing delegated
work, read `docs/codex-workflow.md`** — the procedure, plus Codex's own role.
Not "consult if unsure": read it. The companion's flag contract is pinned to one
plugin version and the polling loop has stop conditions that are wrong to guess
at. It must say `v8`, matching this block; if it is missing or differs, **say so
and stop rather than working from memory** — a stale procedure is worse than
none, being confidently wrong. Re-run `/codex-workflow-setup` to restore the pair.

## Rules that are already damage by the time you notice

Here, not in the reference, because reading them afterwards is too late.

- **Of the `/codex:*` commands you may invoke ONLY `/codex:rescue` and
  `/codex:setup`.** `status`, `result`, `review`, `adversarial-review`,
  `transfer` and `cancel` set `disable-model-invocation: true` — they are
  USER-invoked. Never say you'll poll, collect, or review with them; name the
  command and ask me to run it. (Plugin v1.0.6 — recheck on upgrade.)
- **Always pass a prompt with `--prompt-file`; never as a positional argument.**
  Positionals are concatenated into a shell command line without escaping:
  backtick-delimited text is **executed and replaced by its output**, silently
  deleting instructions, and newlines collapse to spaces.
- **Write prompt files OUTSIDE the repository**, and **never write into the
  working tree while a delegation is live.** Codex deletes untracked files that
  appear after it starts, treating them as its own tooling residue.
- **Never `--resume` after a dead or crashed worker.** The record permanently
  blocks resume for that workspace (`Task <id> is still running`) and no
  supported command clears it. Relaunch `--fresh`, restating the working-tree
  state in the prompt.
- **Never enable the review gate** (`/codex:setup --enable-review-gate`): in this
  workflow it can loop Claude↔Codex and drain usage limits. Reviews stay manual.
- **The sandbox patch is machine-wide.** A SessionStart hook rewrites the
  plugin's hardcoded sandbox to `danger-full-access`, giving Codex full
  filesystem and network access in *every* project on this machine, including
  ones that never opted in. Unpatched, Codex can neither commit nor reach the
  network. State with `node ~/.claude/scripts/codex-full-access-patch.mjs
  --check`; undo with `--revert`.
- **`/codex:setup` reporting `ready: true` certifies almost nothing.** It tests
  neither egress, nor `.git` writability, nor the resume path. Read it as "the
  CLI exists and is authenticated", nothing more.

## Step 1 — Offload decision (before implementation)

Offloading is a choice, not a default. Recommend one way or the other with a
one-line reason; never offload silently.

**Before anything else, check the first task for a package-manager or network
step.** If it runs `npm install`, `pip install`, `go get`, a registry fetch, an
API call or a container pull, either the sandbox patch must be active or you
install the dependencies yourself first and delegate the rest. Do not delegate a
task whose first action is an install and hope.

OFFLOAD when the work is a genuine multi-task feature (~3+ discrete tasks) and
the plan is self-contained enough for a fresh session.

DO NOT offload — do it yourself — when it's small (one file, a quick bugfix, a
config tweak), or when you foresee friction:
- Codex lacks access it needs (a credential, a private dependency, a service
  only wired into this environment).
- The change is format- or tooling-sensitive in a way Codex may not honour
  (formatter/linter config, generated files, codegen, pre-commit hooks, import
  ordering, encoding).
- The task needs live context from this session that won't travel in a plan file.
- Tight feedback loops where round-tripping is slower than doing it inline.

**Token overhead is not the deciding factor on the default path.** A direct
companion call costs a few hundred Claude-side tokens; the `/codex:rescue`
subagent costs ~20k regardless of task size. So the reason not to offload small
work is *coordination* cost — context that won't travel, review round-trips —
not tokens.

## Step 2 — Path, model and effort

- `DEFAULT_DELEGATION: plugin` → delegate via the Codex bridge without asking.
- `DEFAULT_DELEGATION: cli` → use the CLI handoff without asking.
- `DEFAULT_DELEGATION: ask` → ask me which to use, with the trade-off, and wait.

Even under `plugin`, recommend switching to the CLI handoff if it's clearly
better for THIS task (very large feature, or my Claude weekly limit is the hard
bottleneck). Say so in one line; don't switch silently.

**Choosing model and effort is mandatory on every delegation, not optional.**
The plugin passes neither flag unless you supply one, so a call with no flags
silently inherits whatever `~/.codex/config.toml` sets globally — typically the
strongest and most expensive option. Scale effort to how much of the task is
*undetermined*, not to how big it is, and step DOWN as often as up. **Apply the
rubric tables in `docs/codex-workflow.md`; the values below are only the floor
they adjust from.**

### Standing preferences (edit to change the defaults)
DEFAULT_DELEGATION: plugin
DEFAULT_MODEL: gpt-6.1-sol
DEFAULT_EFFORT: medium

## Steps 3–6 — Plan, execute, review, report friction

All four are in `docs/codex-workflow.md`. Two obligations survive here because
they bind even when the delegation never happens:

- **Plan first, always, regardless of path** — the standard Superpowers flow to
  `docs/plans/<feature>.md`, committed before delegating.
- **Review always, regardless of path** — an independent second pass over the
  diff, never a rubber stamp on Codex's own inline review. And when the
  integration itself misbehaves, file a report with the `codex-workflow-feedback`
  skill after the session recovers or gives up.
<!-- codex-workflow:end -->
