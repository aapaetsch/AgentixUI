# Phase A Bugfix Handoff

> Code review of the 10 new `@agentix/ui` components shipped in commit
> `d7be5a4` ("feat(ui): Phase A finance/quant primitives").
>
> Source: two parallel Explore-subagent reviews (text/form + viz). Each issue
> is classified by severity and includes a file:line reference and proposed fix.
> Static type-check (`npx tsc --noEmit`) was clean across all files — every
> issue below is a runtime, design, or behaviour problem that TS cannot catch.
>
> **Use this file as a work list. Fix top-down. Re-run
> `npx tsc --noEmit && npm run build && npm run build-storybook` after each fix.**

## Severity legend

| Marker | Meaning |
|--------|---------|
| 🔴 BLOCKER | Will crash or behave wrong at runtime / a11y failure / React warning storms. Fix before any further work. |
| 🟠 MAJOR | Broken edge case, inert feature, missing required variant behaviour, misleading API. |
| 🟡 MINOR | Polish, doc drift, cohesion inconsistency, story gap. |
| 🟢 NIT | Style, redundancy, cosmetic. |

## Quick triage counts

| Severity | Count |
|----------|-------|
| 🔴 BLOCKER | 2 |
| 🟠 MAJOR | 6 |
| 🟡 MINOR | 13 |
| 🟢 NIT | 6 |

---

## 🔴 BLOCKERS — fix first

### B1. Sparkline — rules-of-hooks violation in `useGradientId`
- **File:** `src/components/sparkline/index.tsx:77-80`
- **Symptom:** `React.useId()` is called *conditionally* inside
  `if (idRef.current === null)`. On mount React registers 2 hooks
  (`useRef` + `useId`); on every subsequent render only 1 fires, triggering
  React's "Rendered fewer hooks than expected" warning and a hard re-render
  failure on the next prop change. This is a latent crash that activates the
  first time a parent re-renders the Sparkline with new props.
- **Fix:** Move `React.useId()` to the top-level of the hook (call it
  unconditionally). The ref memoisation isn't buying anything since `useId()`
  is already stable across renders.
  ```tsx
  // before (broken)
  function useGradientId(...) {
    const idRef = useRef<string | null>(null);
    if (idRef.current === null) {
      idRef.current = React.useId();   // ❌ conditional hook
    }
    return idRef.current;
  }

  // after (correct)
  function useGradientId(prefix: string) {
    const raw = React.useId();
    const idRef = useRef<string | null>(null);
    if (idRef.current === null) {
      idRef.current = `${prefix}-${raw.replace(/:/g, "")}`;
    }
    return idRef.current;
  }
  ```
- **Stories to add:** none required — existing stories will trigger this once
  extended to a `key`-forced remount or a parent that updates the data array.

### B2. VisuallyHidden — invalid Tailwind utility classes for clip/focus-reveal
- **File:** `src/components/visually-hidden/index.tsx:40-42`
- **Symptom:** `clip-[rect(0,0,0,0)]` and `focus:clip-auto` produce **no CSS**
  at build time. The legacy `clip` CSS property is not a Tailwind utility and
  Tailwind v3 has no `clip-auto` variant. The base hidden state still works
  via the `w-[1px] h-[1px] overflow-hidden whitespace-nowrap` combo, but the
  documented "skip-to-content" focus-reveal pattern relies on inert
  classes. Worse, the doc claim that these utility classes do the reveal is
  actively misleading.
- **Fix:** Swap to the official Tailwind pair:
  - Base hidden: `sr-only` (Tailwind's built-in pattern uses
    `clip-path: inset(50%)` etc.)
  - Focus reveal: `focus:not-sr-only` (Tailwind's documented pair)
  - Keep `absolute` plus the `focus:` overrides on dimensions / overflow.
  Final class string:
  ```
  sr-only absolute focus:not-sr-only
  focus:absolute focus:w-auto focus:h-auto focus:p-2 focus:m-0
  focus:overflow-visible focus:whitespace-normal
  ```
- **Verify:** the "Skip to content" Storybook story should reveal the link on
  keyboard focus. Update `agents.md` to drop the obsolete
  "explicit clip utilities, not sr-only" note.

---

## 🟠 MAJOR — fix before closing Phase A

### M1. Label — `peer-disabled:*` styling is inert
- **File:** `src/components/label/label.stories.tsx:33-41`
- **Symptom:** The `WithDisabledInput` story claims to demonstrate
  `peer-disabled:cursor-not-allowed peer-disabled:opacity-70` styling, but
  the paired `<Input>` never sets `className="peer"`, so the peer selector has
  no peer to match. The story silently renders with normal opacity when the
  input is disabled — the exact opposite of what it advertises.
- **Fix (pick one):**
  - **(a) Add `peer` to `Input`'s base class** in
    `src/components/input/index.tsx` (clean solution, makes the shadcn
    pattern work for every Label paired with Input).
  - **(b) Patch the Label story** to wrap `<Input className="peer ...">` and
    document the consumer-facing pattern in `agents.md` (minimal change,
    keeps `Input` untouched).
- **Recommendation:** (a) — matches the shadcn convention the workspace
  follows everywhere else.

### M2. EmptyState — spacing does not match spec
- **File:** `src/components/empty-state/index.tsx:143-167`
- **Symptom:** Spec says icon→title(2), title→description(1),
  description→action(4). The implementation uses layered `gap-2` outer +
  `gap-1` inner cluster + an `mt-2` wrapper around `action`, producing
  inconsistent spacing. Net effect: when `description` is omitted, the
  action sits roughly `gap-2 + mt-2` (1rem) below the title — close to
  spec but achieved via a stacked hack that breaks the cluster semantics.
- **Fix:** Drop the `mt-2` wrapper. Use:
  - Outer container: `gap-4` (the spec's description→action = 4).
  - Inner title/description cluster: `gap-1` (title→description = 1).
  - Icon slot sits directly above the cluster (still `gap-4`, which is
    slightly more than spec's 2 but visually fine; alternatively use a
    three-tier structure with explicit `space-y-N` on each tier).
- **Verify stories:** `Default`, `WithDescription`, `WithAction`,
  `SizeSm/Md/Lg` look balanced with and without `description`.

### M3. VisuallyHidden — polymorphic `as="a"` ref type is `HTMLElement`
- **File:** `src/components/visually-hidden/index.tsx:22-25`
- **Symptom:** `forwardRef<HTMLElement, VisuallyHiddenProps>` always types
  the ref as `HTMLElement`. When `as="a"` is used (the documented skip-link
  pattern), consumers passing `ref={anchorRef}` with
  `anchorRef: Ref<HTMLAnchorElement>` get a TS mismatch and lose the
  `HTMLAnchorElement` API (e.g. `.href`, `.focus()` still works but typed
  access requires a cast).
- **Fix:** Either:
  - **(a) Generic forwardRef** — `VisuallyHidden<T extends React.ElementType>`
    with ref typed as `React.ElementRef<T>`. More idiomatic but requires
    moving to a function component + `asProp` pattern (no `forwardRef`).
  - **(b) Accept and document** — leave `HTMLElement` and add a JSDoc
    note "for `as="a"` use sites, cast the ref via `as HTMLAnchorElement`".
- **Recommendation:** (a) long-term, (b) for this handoff cycle to keep the
  blast radius small. Document the limitation explicitly.

### M4. Sparkline & MiniBars — inline `width`/`height` defeats Tailwind sizing
- **Files:** `src/components/sparkline/index.tsx:236-241`,
  `src/components/mini-bars/index.tsx:200-205`
- **Symptom:** Both components set `style={{ width, height, ... }}` on the
  container, which wins the CSS cascade over `w-*`/`h-*` classes.
  Sparkline's JSDoc *explicitly promises* Tailwind sizing — but the
  `ResponsiveWidth` story (`className="w-full text-primary"`) and the
  `InsideStatTile` stories (`className="w-full h-full"`) **do not actually
  fill their parent**. The props override the classes silently.
- **Fix:** Move `width`/`height` to SVG presentation attributes (e.g.
  `width={width}` on `<svg>`), or only set inline styles when the consumer
  has not supplied `w-*`/`h-*` via `className`. Easiest:
  ```tsx
  // drop inline width/height; let CSS drive container; SVG uses viewBox
  <svg viewBox={`0 0 ${width} ${height}`} className={cn("w-full h-full", className)} ...>
  ```
- **Note:** This interacts with B1 — fix both together.

### M5. SegmentedProgress — `max` < `sum` silently ignored
- **File:** `src/components/segmented-progress/index.tsx:148-150`
- **Symptom:** `const total = max != null && max > sum ? max : sum;` — when
  `max=50` and segments sum to 100, `total = sum = 100`. The bar fills
  completely with no remainder and `max` is effectively dropped. The
  agents.md only documents the `max > sum` remainder case; the
  `max < sum` case is undocumented and misleading.
- **Fix:** Either:
  - **(a) Scale to `max`** — `effectiveTotal = max != null ? max : sum` and
    divide each segment by `effectiveTotal` (values > 1.0 get clipped or
    allowed to overflow visually).
  - **(b) Warn in dev** — `if (max != null && max < sum) console.warn(...)`
    and keep current behaviour.
- **Recommendation:** (a) with overflow allowed (segments > 1.0 visually
  bleed past the bar end). Update `agents.md` and add a story.

### M6. SegmentedProgress — palette is non-reactive to theme changes
- **File:** `src/components/segmented-progress/index.tsx:73-82`
- **Symptom:** `buildChartPalette()` runs once at module import via
  `resolveToken(getComputedStyle(document.documentElement))`. On SSR the
  tokens are empty → segments fall back to `currentColor` (correct). But
  in the browser:
  - If the CSS hasn't loaded when the JS chunk executes, the palette will
    be permanently empty-string for the session.
  - Runtime dark↔light or custom-theme switches do NOT update the palette
    because the module-level `chartPalette` is never recomputed.
- **Fix:** Compute the palette inside the component via `useMemo` (with a
  theme-change listener if you support runtime theme switching). Minimum
  viable:
  ```tsx
  const palette = useMemo(() => buildChartPalette(), []);
  ```
  This re-runs once per mount, which catches late CSS load. For full theme
  reactivity add a `MutationObserver` on `document.documentElement` class
  or `data-theme` attribute.

---

## 🟡 MINOR — fix when convenient

### m1. TrendIndicator — `signed` prefix dropped when direction is forced opposite the value sign
- **File:** `src/components/trend-indicator/index.tsx:118`
- **Symptom:** `defaultFormat(value, signed && resolved === "up")` gates
  the `+` prefix on `resolved === "up"`. So `value=1.2, direction="down",
  signed=true` produces `"1.20"` instead of `"+1.20"`. Contract says `signed`
  should prefix `+` on positive values regardless of direction.
- **Fix:** `defaultFormat(value, signed && value > 0)`.

### m2. EmptyState — no story coverage for `icon={false}`
- **File:** `src/components/empty-state/empty-state.stories.tsx`
- **Symptom:** Code handles `icon === null || icon === false` but only
  `icon={null}` has a story. `icon={false}` is documented but untested.
- **Fix:** Add a small story passing `icon={false}`.

### m3. `tsc-check` excludes `*.stories.tsx`
- **File:** `tsconfig.json:24`
- **Symptom:** Story files are not type-checked in CI. Errors like the
  Sparkline `variant` argType typo (see m4) slip through.
- **Fix:** Either:
  - Add a separate `tsconfig.stories.json` that includes `*.stories.tsx`
    and wire it into CI (lighter: only type-check, don't emit).
  - Or remove the exclusion and accept that `tsc` runs over stories
    (may need `noEmit` plus `allowJs`/`skipLibCheck` tuning).
- **Workspace-level** fix, not component-specific.

### m4. Cohesion: TrendIndicator neutral color differs from NumericText zero color
- **Files:** `src/components/trend-indicator/index.tsx:121` vs
  `src/components/typography/index.tsx` (`NumericText`)
- **Symptom:** `TrendIndicator` renders `value=0` in `text-muted-foreground`
  while `NumericText colorize` renders `0` in `text-foreground` (because
  `pnlColorClass(0) === "text-foreground"`). Two finance primitives rendering
  the same value produce different colors side by side.
- **Fix:** Pick one. Recommendation: have `TrendIndicator` use
  `text-foreground` for zero/neutral so it matches `NumericText`. Document
  the choice in `agents.md`.

### m5. Sparkline — area gradient uses default `objectBoundingBox`
- **File:** `src/components/sparkline/index.tsx:152-161`
- **Symptom:** The `<linearGradient>` doesn't specify `gradientUnits`, so
  it defaults to `objectBoundingBox` — the gradient spans the *bounding
  box of the path* rather than the chart area. For lines where the max
  value never reaches the top of the viewBox, the gradient top-anchor
  moves with the line's max rather than staying pinned to the chart top.
- **Fix:** Add `gradientUnits="userSpaceOnUse"` with `y1="0"` and
  `y2={height}` so the fade is anchored to the chart area.

### m6. Sparkline — `variant="bar"` does not document negative-value behaviour
- **File:** `src/components/sparkline/index.tsx:178-189`
- **Symptom:** `normalize()` clamps to `[0,1]`. Negative values map to 0
  and render as minimum-height bars at the baseline — visually misleading.
- **Fix options:** Either reject negatives with a warning, delegate the
  divergent use case to `MiniBars` (already exists), or render negatives
  downward from the baseline. Document whichever you pick.

### m7. Sparkline Storybook `variant` argType uses invalid API
- **File:** `src/components/sparkline/Sparkline.stories.tsx:20`
- **Symptom:** `variant: { control: { select: ["line", "area", "bar"] } }`
  is invalid Storybook API. Correct form:
  `{ options: ["line", "area", "bar"], control: { type: "select" } }` (or
  `control: "inline-radio"`). As written, the controls panel falls back to
  a text input for `variant`.
- **Fix:** Switch to the documented API.

### m8. MiniBars — partial `positiveColor`/`negativeColor` silently ignored
- **File:** `src/components/mini-bars/index.tsx:158-164`
- **Symptom:** `divergent = positiveColor != null && negativeColor != null`.
  If only one is supplied, *both* sides fall back to `color`. The JSDoc says
  "Ignored when both positiveColor and negativeColor are provided" — that
  wording implies one might do something, but it doesn't.
- **Fix:** Either honor the supplied half-palette (use it for that side,
  fall back to `color` for the other) or update the docstring to say
  "Must be provided together; partial values are ignored."

### m9. MiniBars — bar position offset becomes negative for extremely dense data
- **File:** `src/components/mini-bars/index.tsx:131-132`
- **Symptom:** `x = i * slot + (slot - barWidth) / 2` where
  `barWidth = max(slot - gap, 0.5)`. When `slot < gap` (very dense data with
  a large gap), `slot - barWidth` goes negative, pushing bars left of their
  slot and causing neighbor overlap.
- **Fix:** `x = i * slot + Math.max((slot - barWidth) / 2, 0)`.

### m10. Gauge — `describeArc` has misleading `start`/`end` variable names
- **File:** `src/components/gauge/index.tsx:120-127`
- **Symptom:** `const start = polarToCartesian(..., endAngle);` and
  `const end = polarToCartesian(..., startAngle);` — `start` holds the
  endpoint at `endAngle`, and vice versa. The path string draws from
  `endAngle` to `startAngle`, opposite of the parameter order. The dial
  happens to render correctly because sweep-flag=0 in this convention,
  but the names are a maintenance landmine.
- **Fix:** Swap the variable names or add a code comment explaining the
  inversion (e.g. `// start = arc end point (we draw backwards)`).

### m11. Gauge — `defaultLabel` uses `clampedValue`, not the animated `displayValue`
- **File:** `src/components/gauge/index.tsx:242-259`
- **Symptom:** During the needle's 400ms tween, the centered numeric label
  snaps immediately to the final value. The user sees the value settle
  before the needle arrives.
- **Fix:** Drive the label off `displayValue` (the animated state) so it
  tweens in sync. Reformatting per frame is cheap. Alternatively document
  the snap behavior.

### m12. Gauge — partial-threshold semantics counter-intuitive
- **File:** `src/components/gauge/index.tsx:212-225`
- **Symptom:** When thresholds don't end at `max` (e.g.
  `{value: 50, color: green}` only), the code appends a final segment from
  `lastThreshold` to `max` colored with the *last threshold's color* — so
  the whole upper region becomes green. Users expecting "below 50 green,
  above 50 default" get the opposite.
- **Fix:** Either document this or fall back to `trackColor` for the
  trailing segment when the last threshold doesn't reach `max`.

### m13. SegmentedProgress — empty `segments` with `max > 0` renders two overlapping muted divs
- **File:** `src/components/segmented-progress/index.tsx:182-194`
- **Symptom:** Empty-array branch renders `<div className="flex-1 bg-muted"/>`.
  Then the `hasRemainder` branch also fires (`max > sum`, since `sum=0`),
  appending another muted div. Two muted divs split the bar 50/50.
- **Fix:** Gate the remainder rendering on `safeSegments.length > 0`, or
  remove the empty-state branch in favor of the remainder alone.

### m14. SegmentedProgress — `role="meter"` lacks aria-valuenow/min/max
- **File:** `src/components/segmented-progress/index.tsx:227`
- **Symptom:** WAI-ARIA `meter` role expects `aria-valuenow`,
  `aria-valuemin`, `aria-valuemax`. Only `aria-valuetext` is set.
- **Fix:** Either switch role to `presentation`/`group`, or compute and
  pass the three aria-valuenow/min/max from the total/sum (the latter is
  tricky since total is an aggregate, not a meter reading — `presentation`
  is probably the right call).

---

## 🟢 NITS — opportunistic cleanup

### n1. TrendIndicator — `.join(" ")` on a single-string CVA base
- **File:** `src/components/trend-indicator/index.tsx:14`
- **Fix:** Drop the `.join(" ")`; pass the string directly to `cva()`.

### n2. FieldLabel — wraps Label with a redundant `cn(className)` call
- **File:** `src/components/field/index.tsx:73-78`
- **Fix:** Pass `className` directly to `Label`; `Label` already merges.

### n3. FieldError — when empty, returns `null` leaving a `space-y-2` gap only if a sibling is present
- **File:** `src/components/field/index.tsx:140`
- **Note:** `space-y-2` collapses around `null` children — no phantom
  spacing in practice. No fix needed; just noting.

### n4. VisuallyHidden — double assignment `as: Comp = "span"` then `const Component = Comp as React.ElementType`
- **File:** `src/components/visually-hidden/index.tsx:26-27`
- **Fix:** Drop the second alias; `Comp` is already `React.ElementType`.

### n5. EmptyState — always renders `<h3>` (heading level not configurable)
- **File:** `src/components/empty-state/index.tsx:158`
- **Note:** When nested inside a Card with its own `<h3>`, this creates an
  a11y heading-level jump. Consider an optional `headingLevel` prop.
- **Fix (later):** Add `headingLevel?: 1|2|3|4|5|6 = 3` and render the
  corresponding element.

### n6. EmptyState — custom icons don't inherit `text-muted-foreground` from icon variants
- **File:** `src/components/empty-state/index.tsx:137`
- **Note:** The `emptyStateIconVariants` base applies `text-muted-foreground`
  to the default `Inbox` icon but not to a consumer-supplied custom icon.
  Consumers have to add `text-muted-foreground` manually (the `CustomIcon`
  story does this).
- **Fix (later):** Wrap custom icons in
  `<span className={emptyStateIconVariants({ size })}>` to enforce the
  muted color; document that custom icons inherit size from the span.
  Tradeoff: consumers who pass a sized icon get double sizing.

### n7. Label — unused top-level `"use client";` directive
- **File:** `src/components/label/index.tsx:1`
- **Note:** Harmless. tsup emits for Web/Electron, not RSC. No action needed.

---

## Recommended fix order

1. **B1 Sparkline rules-of-hooks** — actual crash.
2. **B2 VisuallyHidden clip utilities** — invisible failure plus misleading docs.
3. **M4 Sparkline/MiniBars sizing** — paired with B1 since you're already in
   Sparkline.
4. **M1 Label peer-disabled** — story is actively wrong; quick fix.
5. **M2 EmptyState spacing** — small change, large polish win.
6. **M5 + M6 SegmentedProgress** — pair both SegmentedProgress majors in one
   pass (max behavior + palette lifecycle).
7. **M3 VisuallyHidden polymorphic ref** — document and move on; full
   refactor can wait.
8. M5 → M13 + remaining minors in one tidy commit each or batched.

## Verification after fixes

```powershell
npx tsc --noEmit -p tsconfig.json
npm run build
npm run build-storybook
```

Optionally add a Storybook test-runner smoke pass (`npm run test-storybook`)
once the rules-of-hooks fix lands — the existing stories will now exercise
the previously-broken `useId` path correctly.

## Out-of-scope noted issues

- The `tsc-check` exclusion of `*.stories.tsx` (m3) is a workspace-level
  concern flagged for the user, not a Phase A component bug.
- TrendIndicator cohesion with NumericText (m4) is a design decision worth
  the user's call rather than a clear fix.

## Changelog entry to add after fixes

Add a row to `docs/roadmap/changelog.md` dated for the fix landing, e.g.:

> 2026-07-XX | Phase A bugfixes — Resolved 2 blockers (Sparkline
> rules-of-hooks, VisuallyHidden clip utilities), 6 majors (Label
> peer-disabled story inert, EmptyState spacing spec drift, VisuallyHidden
> ref typing, Sparkline/MiniBars Tailwind sizing override, SegmentedProgress
> `max<sum` silent drop, SegmentedProgress palette non-reactivity), and N
> minor issues. See `docs/bugfix-handoff-phase-a.md`.