# Handoff: Timeline label real-width fix — PR #8

**Status:** READY TO MERGE (independently reviewed). Human merges; orchestrator never merges.

## The bug
User reported the rightmost long label ("Start Aanvullende vaste vergoeding") still overflowed the
graph plot area and produced a horizontal scrollbar, even after the PR#7 coreWidth clamp was live.
It moved left to `left:620px` (the clamp firing) but the visible text still spilled past.

## Root cause (verified)
`layoutLabels()` in `src/charts/renderers/chart-timeline.ts` did:
`const width = Math.min(label.width, config.maxWidth, cw)` with `LABEL_CONFIG.maxWidth = 200`, and
`styling/img-timeline.scss` had `.html_label { max-width: 200px }`.
The long label's real rendered width is ~238–288px (0.85rem, title case). So the layout fitted a
200px box and clamped `left + 200 <= plotRight` (hence 620 = plotRight − 200), while the glyphs did
not wrap into the 200px box and spilled past the clamped box → persistent overflow.

## The fix (PR #8, branch fix/timeline-label-realwidth, base feat/fix-groups-placeholders)
- `src/charts/renderers/chart-timeline.ts`:
  `const width = Math.min(label.width, cw);` — cap only by the container, never an arbitrary 200px.
  Removed `LABEL_CONFIG.maxWidth` and the `config.maxWidth` type field. The coreWidth clamp
  (`left + width <= cw`) still holds by construction; a label wider than the container clamps to
  the left edge with no NaN/infinity/overflow.
- `styling/img-timeline.scss`: removed `.html_label { max-width: 200px }`; added
  `overflow-wrap: anywhere` safety net.
- Two-phase row assignment + height attribution untouched (stale-top / height-undercount fixes intact).
- Tests: new `test/timeline-label-realwidth.test.ts` (regression + wider-than-container degrade,
  both provably RED pre-fix), updated `test/timeline-label-layout.test.ts` for real-width semantics.

## Gates (verified by tech lead at commit d6c8868)
- vitest: 20 files, 366 passed / 3 skipped (incl. 17 timeline tests green: realwidth 3, layout 12, overflow-repro 2)
- tsc --noEmit: clean
- webpack build:dev: OK

## Independent review (brain/timeline-pr8-review.md)
VERDICT: READY TO MERGE. No blocking/major/minor. Nits only:
- Pre-existing `test/timeline-overflow-repro.test.ts` still models a 200px-capped `mockLayout`, so
  it does NOT exercise the new real-width path — it still guards the PR#7 plot-area clamp. The
  real-width behavior is only covered by `timeline-label-realwidth.test.ts`. Consider a comment.
- `overflow-wrap:anywhere` can affect min-content sizing / measured offsetWidth for very long words;
  acceptable safety net, but note the interaction if label widths ever look unstable.

## Repo-topology note (follow-up, not part of PR #8)
- The default branch `main` (origin/main = caa5883 "brain implant") is a POLLUTED local-history line
  that swept in pre-existing WIP (`numbers-v1.ts`, `regelingen/config.ts`, `default-group-v1.ts`) and
  the `brain/` docs.
- The clean, complete trunk containing PR#5 + PR#7 is `feat/fix-groups-placeholders` @ 7f4a118
  (PR#7 merged there, NOT into main). PR #8 is correctly based on that trunk.
- Recommend reconciling: decide whether `main` should be reset to track the clean trunk, so future
  PRs merge into a clean main and `img` (stale default before) is archived. Not done yet.
