# Repo admin handoff — rename, main cleanup, content recovery

**Date:** 2026-08-28

## Repository renamed
- `DePubliekeZaak/img-2` → **`DePubliekeZaak/img-dashboard`** (GitHub auto-redirects old name).
- All local remotes point at `img-dashboard` (user updated them). Update any external config / CI that names the old URL.

## `main` is now the clean trunk
- `main` @ the clean trunk `c095e67` (contains PR #5 label layout, PR #7 coreWidth clamp, PR #8 real-width label fix — all merged).
- The previous default `img` was a stale, divergent history; delete when convenient.
- The old polluted `main` line is preserved as **`wip-brain-implant`** (holds the WIP + brain docs as they were mid-flight).

## Content recovered via PR #9 (`recover/lost-content`, base main)
The `main` force-update to the clean trunk dropped WIP content that only lived on the old main line. Restored faithfully from `wip-brain-implant`:
- `src/pages/timeline.ts` — 4 timeline items: Start Aanvullende vaste vergoeding (2025-10-21), Start vaste herhaalvergoeding (2026-04-08), Geelbroek (2026-3-14), Zandeweer (2026-8-21).
- `src/json/groups.json` — Geelbroek / Zandeweer / Start Aanvullende vaste vergoeding additions to the vaste-vergoeding regeling timeline arrays.
- `brain/` — the 8 handoff/findings/review docs (also rewritten `img-2` → `img-dashboard`).

**Deliberately NOT restored** (would regress the label fixes or reintroduce junk):
`chart-timeline.ts`, `img-timeline.scss`, `timeline-label-layout.test.ts` (old pre-PR7/8), `regelingen/config.ts` (stray-backtick typo `"de`finitions"`), `numbers-v1.ts`, `default-group-v1.ts` (blank-line noise).

## Branch cleanup guidance
- **Deleting a branch never deletes its PR** — merged/closed PRs keep conversation, reviews, commits, and diff indefinitely, even after the branch is removed. So cleanup is safe for PR history.
- **But content committed as files is NOT in the PRs** — it lives on the branch. `wip-brain-implant` still holds pre-recovery content; keep it (or fold remaining WIP into main) until PR #9 is merged and the recovery is confirmed. After that, safe to delete `wip-brain-implant`, `img`, `feat/groups-placeholders`, `fix/gemeente-*`, `page-segmenting`, `feat/timeline-label-layout`, `fix/timeline-label-overflow`*.
- CLI force-push and branch deletion are blocked by the environment's blast-radius policy — do rewrites/delete via the GitHub web UI.
