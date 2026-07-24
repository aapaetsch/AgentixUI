# Touch-Friendliness Audit — aapaetsch-ui-kit

> **Generated:** 2026-07-20
> **Scope:** All 75 components under `src/components/`
> **Target devices:** iPad / iPhone / touch devices (iOS Safari + touch-input devices)
> **Method:** Read-only audit by parallel subagents against a 13-point touch-friendliness checklist (tap-target size, hover-only affordances, drag/cursor assumptions, keyboard-only paths, input usability, scroll behavior, gestures, long-press, focus rings, fixed positioning, performance, viewport assumptions).
>
> **Remediation status:** Implemented 2026-07-20. The primary P0/P1 findings are now addressed in shared primitives and affected finance widgets. Compact variants remain available where they are part of the public API, while default interaction surfaces, touch scrolling, dynamic viewport handling, and safe-area behavior were upgraded without changing controlled/uncontrolled state contracts.

## Implementation summary (2026-07-20)

- Raised default action, menu, picker, pagination, tab, stepper, toolbar, data-table, order-book, and time-and-sales targets to touch-safe dimensions; enlarged slider, carousel, close, resize, and sheet-handle hit regions without enlarging their visual glyphs.
- Prevented iOS focus zoom in shared inputs, textareas, comboboxes, multi-select search, command palette search, and data-table search; search controls now expose mobile keyboard hints and disable unwanted autocomplete.
- Added dynamic viewport sizing, safe-area padding, contained overscroll, momentum scrolling, and directional touch-action rules across dialogs, sheets, navigation drawers, popovers, toasts, tables, pickers, and scrolling market widgets.
- Replaced date and date-time clear pseudo-buttons with independent native buttons, avoiding nested interactive controls; the date-time picker now stacks its side-by-side layout on narrow screens without changing the requested layout mode.
- Added pointer-driven checkbox/radio ripples, touch-visible pressed states, keyboard semantics for interactive cards, `matchMedia` breadcrumb responsiveness, and accessible toolbar labels derived from tooltip text.
- Scoped frequently used motion transitions and added touch-visible states while retaining the existing component APIs, variants, callbacks, and keyboard interactions.

The detailed findings below are retained as the historical audit baseline and rationale for the implementation.

---

## Executive summary

Of 75 components audited:

| Status | Count | Examples |
|---|---|---|
| ❌ Not touch-friendly | 13 | `chip`, `combobox`, `command-palette`, `context-menu`, `data-table`, `date-picker`, `date-time-picker`, `dropdown-menu`, `leg-builder-row`, `resizable`, `time-picker`, `carousel`, `breadcrumb` |
| ⚠️ Minor issues | 26 | `accordion`, `alert`, `alert-dialog`, `button`, `carousel`, `checkbox`, `dialog`, `fab`, `gauge`, `greeks-display`, `input`, `input-incrementor`, `multi-select`, `navigation`, `order-book`, `pagination`, `payoff-diagram`, `popover`, `radio`, `scroll-area`, `select`, `sheet`, `slider`, `stepper`, `strikes-navigator`, `switch`, `table`, `tabs`, `textarea`, `time-and-sales`, `toast`, `toggle-group`, `toolbar`, `tooltip` |
| ✅ Touch-friendly / N/A presentational | 36 | `animated-chevron`, `animated-number`, `avatar`, `badge`, `breakeven-badges`, `card`, `container`, `empty-state`, `expiry-badge`, `field`, `flex`, `greeks-decay-chart`, `grid`, `hover-card` (mostly), `iv-chart`, `kbd`, `label`, `mini-bars`, `option-symbol-badge`, `progress`, `segmented-progress`, `separator`, `skeleton`, `sparkline`, `spinner`, `spread-type-selector`, `switch` (✅), `typography`, `visually-hidden`, `trend-indicator`, ... |

(Counts overlap because some components are presentational-but-with-caveats.)

### Cross-cutting themes (apply to many components)

1. **Tap-target size below 44×44 px** (Apple HIG minimum). The single most pervasive issue. Default `md` sizes in `button`, `input`, `select`, `combobox`, `multi-select`, `time-picker`, `date-picker`, `pagination`, `toggle-group`, `toolbar`, `stepper`, `tabs`, `strikes-navigator`, `time-and-sales`, `order-book` are all 28–40 px tall.
2. **Hover-only affordances** with no `active:`/tap equivalent. Recurs in `resizable` (grip), `scroll-area` (`hover` visibility), `slider` (value indicator), `stepper` (trigger opacity), `toast` (close button), `toolbar` (buttons), `tooltip` (the tooltip itself), `greeks-display` (tooltip labels), `alert` (close opacity), `accordion` (underline), `breadcrumb` (links), `payoff-diagram` (crosshair tooltip on touch tap).
3. **iOS auto-zoom-on-focus** for inputs/combobox/textareas with `text-sm`/`text-xs` fonts (< 16 px). Affects `input`, `combobox`, `multi-select`, `command-palette`, `textarea`, `strikes-navigator` jump input, `data-table` toolbar search.
4. **No `env(safe-area-inset-*)` handling** on any modal/sheet/popover/toast/fab/navbar — content can be clipped by iPhone notch / dynamic island / home indicator.
5. **`100vh` vs `100dvh`** — `alert-dialog`, `dialog`, `sheet`, `toast`, `time-picker` popover can collide with iOS Safari's dynamic toolbar.
6. **Missing momentum-scroll / overscroll-behavior** on scroll containers — `scroll-area`, `combobox` options, `multi-select`, `data-table`, `order-book`, `time-and-sales`, `strikes-navigator`, `time-picker` columns.
7. **`onMouseDown`-only ripple/dismiss** (should be `onPointerDown`) — `checkbox`, `radio`, `combobox` clear button (sometimes).
8. **`<span role="button">` instead of `<button>`** — `chip` dismiss, `date-picker`/`date-time-picker` clear buttons. Unreliable for iOS touch / SR.
9. **`cursor-pointer` / `cursor-help`** set purely for mouse — harmless but meaningless on touch; gate behind `@media (hover: hover)` or remove.
10. **`:focus-visible` reliance** without an `active:` fallback — iOS Safari inconsistently fires `focus-visible` on tap; many components lose their tap-state visual.
11. **Tooltip-as-only-label** — `toolbar` icon-only buttons use `tooltip` to label themselves; Radix `Tooltip` doesn't open on tap, so the label is unreachable on touch.
12. **Height-animating accordions/steppers** (not transform/opacity) — can jank on low-end iPads; no `will-change` or `prefers-reduced-motion` guard.
13. **Horizontal scroll regions** (`table`, `data-table`, `toggle-group wrap=false`, `breadcrumb` list) without `overscroll-behavior-x: contain` / `touch-action: pan-x` fight with iOS swipe-to-go-back.
14. **Fixed pixel widths** in `popover` (`w-96` = 384px > 375px viewport), `sheet`, `date-time-picker` `side-by-side` default layout — overflow horizontally on phone.
15. **`transition-all`** used broadly — animates layout properties and can jank; scope to transform/color/opacity where motion is frequent.

---

## Priority remediation roadmap

The list below orders work by **user impact × frequency of use**. P0 = blocks the feature on touch. P1 = visible/annoying but functional. P2 = polish.

### P0 — Critical / blocking on touch

| # | Component(s) | Issue | Fix (one-line) |
|---|---|---|---|
| 1 | `input`, `textarea`, `combobox`, `multi-select`, `command-palette`, `strikes-navigator`, `data-table` toolbar | Input font < 16 px → **iOS auto-zooms the page on every focus** | Default `md`/`lg` to `text-base` (16 px); add `text-[16px]` fallback for `sm` |
| 2 | `combobox`, `multi-select`, `command-palette` search inputs | Missing `inputMode`/`enterKeyHint`/`autoComplete` | Add `inputMode="search" enterKeyHint="search" autoComplete="off"` |
| 3 | `chip` dismiss, `date-picker` clear, `date-time-picker` clear, `toast` close | `<span role="button">` + 16–24 px hit area | Promote to `<button type="button">`; wrap in `min-h-11 min-w-11 flex items-center justify-center` hit-slop |
| 4 | `date-time-picker` `side-by-side` default | Overflows 375 px viewport horizontally | Auto-switch to `tabs` layout on `max-width: 640px` via `useMediaQuery`; cap popover `max-w-[calc(100vw-1.5rem)]` |
| 5 | `alert-dialog`, `dialog`, `sheet`, `toast`, `time-picker` popover, `navigation` drawer | No `env(safe-area-inset-*)` + uses `100vh`/fixed pixels | Add `pt/pb/px-[max(1.5rem,env(safe-area-inset-*))]`; switch to `100dvh` / `min-h-dvh`; add `overscroll-behavior: contain` to overlays |
| 6 | `resizable` handle | 1 px `w-px` handle + `group-hover` grip → invisible & untappable on touch | Add invisible `before:absolute -inset-2` hit-slop ≥ 44 px; reveal grip via `active`/`data-[active]` instead of `hover`; add `touch-none` |
| 7 | `time-picker` | 28–32 px triggers/items, no snap, programmatic scroll fights touch | Min-height 44 px (`h-11`); add `scroll-snap-y mandatory` + `scroll-snap-align:start` to wheel items; select-on-scroll-stop via `IntersectionObserver`; add `overscroll-behavior: contain` + `-webkit-overflow-scrolling: touch` |
| 8 | `command-palette` | No on-screen path to open (only ⌘K); 28 px items; `text-sm` input | Render a default `CommandPaletteTrigger` (or doc requirement); `min-h-[44px] py-2.5` items; input `text-base` + `inputMode="search"`; safe-area padding on `DialogContent` |
| 9 | `context-menu`, `dropdown-menu` | 28 px items; right-click only with no mobile fallback | Default item padding to `py-2.5`/`min-h-[44px]`; provide a `DropdownMenu`-based overflow alternative for touch; hide shortcut hints `@media (hover: none)` |
| 10 | `toolbar` icon-only buttons + `tooltip` | Sub-44 px buttons; tooltip is the *only* label → unreachable on touch | Add `xl`/touch size (`size-11`); always pass `aria-label` alongside `tooltip`; add long-press-to-show tooltip fallback on `TooltipTrigger` |

### P1 — High / visible but functional

| # | Component(s) | Issue | Fix |
|---|---|---|---|
| 11 | `button` | Default `md` = 36 px; icon-only xs/sm/md undersized | Raise `md` to `h-11` (44 px) for primary actions; document icon-only `sm`/`md` as desktop-only; add `active:` to `text`/`link` colorStyles |
| 12 | `select`, `combobox`, `multi-select`, `date-picker`, `date-time-picker`, `input` triggers | Trigger heights 28–40 px (all below 44) | Add a `touch` size variant ≥ `h-11`; OR document `lg`/`xl` as the touch-required size |
| 13 | `carousel` indicators | Dot buttons 8 px hit area; arrows 36 px | Wrap indicators in `size-11 flex items-center justify-center`; default arrows to `size="lg"`; add `active:bg-muted-foreground/70` |
| 14 | `pagination` links | `md` 36 px; `gap-1` (4 px) | Default to `lg`/`h-11`; bump `gap-1` → `gap-2` min |
| 15 | `stepper`, `tabs`, `toggle-group`, `toolbar` triggers | `sm`/`md` < 44 px; hover-only affordance | Add `min-h-11` default-for-touch; add `active:bg-accent/70`; add `[touch-action: manipulation]` |
| 16 | `slider` thumb | 4 px visual = 4 px hit area; `showValueIndicator="hover"` only | Add invisible `before:absolute inset-[-8px]` hit-slop on `Thumb`; default indicator to `"always"` on touch; restore `focus-visible:ring-2` |
| 17 | `sheet` close + handle | Close 16–24 px; handle 6 px tall | Close button `min-w-11 min-h-11`; handle wrapped in `min-h-11` hit-slop; add safe-area padding; use `dvh`/`dvw` for `full` size |
| 18 | `dialog`, `alert-dialog` close button | ~16 px hit area; hover-only opacity | `size-9`+ explicit hit-slop; `active:` opacity state; safe-area padding for `fullscreen` |
| 19 | `alert` close | 24 px hit area; hover-only opacity | `size-11` wrapper; `active:` opacity |
| 20 | `accordion` triggers | `sm` 26 px; hover-only underline; height-animation jank | `min-h-[44px]` on triggers; replace `hover:underline` with `active:underline`; add `will-change: height` or animate `grid-template-rows` |
| 21 | `breadcrumb` links + ellipsis | Links < 44 px; ellipsis 36 px; `gap-1.5` mobile | `min-h-[44px]` on links; bump ellipsis to `size-11`; mobile `gap-2`; replace `window.innerWidth` with `matchMedia` for orientation correctness |
| 22 | `checkbox`, `radio` ripple | `onMouseDown`-only; `opacity-38` invalid class | Switch to `onPointerDown`; fix `opacity-38` → `opacity-[0.38]`; bump `sm` state layer ≥ `size-10` |
| 23 | `data-table` row actions / column headers / sticky header / overflow | 32 px buttons; `overflow-hidden` surface clips wide tables | Row actions `h-11 w-11`; wrap `Table` in `overflow-x-auto` with `overscroll-x-contain` + `-webkit-overflow-scrolling: touch`; add `inputMode="search"` on toolbar input |
| 24 | `order-book`, `time-and-sales`, `strikes-navigator` rows | 16–28 px interactive rows; no `active:`; no overscroll/`-webkit-overflow-scrolling` | Expose `dense` prop defaulting to ≥ 44 px on touch; add `active:bg-accent/50`; add `overscroll-behavior: contain` + `touch-action: pan-y` on scroll containers; pause autoscroll on `pointerdown` |
| 25 | `payoff-diagram` | `touch-none` traps vertical scroll; no tooltip on tap; O(n) per `pointermove` | Use `touch-pan-y` (default) instead of `touch-none`; add `onClick` to pin hovered point on touch; throttle `pointermove` via `requestAnimationFrame`; add `will-change: transform` to crosshair |
| 26 | `tooltip` wrapper | Doesn't open on tap in iOS Safari — breaks `toolbar`/`greeks-display` labeling | Add long-press-to-show fallback on `TooltipTrigger`; always mirror tooltip text into `aria-label`/`aria-describedby`; document that tooltips must not be the *only* affordance |
| 27 | `toast` close | Hidden by default (`opacity-0`), hover-only reveal; sub-44 px; `max-h-screen` | Always-visible on touch (`opacity-100 sm:opacity-0 sm:group-hover:opacity-100`); `min-w-11 min-h-11`; viewport `max-h-[100dvh]` + safe-area padding |
| 28 | `fab` sm size + positions | `sm` 40 px; flat `1rem` offset ignores home indicator | `sm: size-11`; use `bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]`; add `active:` background |

### P2 — Polish

| # | Component(s) | Issue | Fix |
|---|---|---|---|
| 29 | `hover-card` close xs; `60vh` vs `dvh` | xs close < 44 px; `60vh` collides with dynamic toolbar | Bump xs/sm close mapping; use `60dvh`; add `overscroll-behavior: contain`; consider `forceTriggerMode="click"` on hybrid devices |
| 30 | `popover` content | No `max-h-[85dvh] overflow-auto`; `w-96` overflows 375 px | Add `max-h-[85dvh] overflow-auto` + `max-w-[calc(100vw-1rem)]` to base content |
| 31 | `scroll-area` `visibility="hover"` | Invisible on touch | Add `active:opacity-100` or `data-[state=visible]:opacity-100` to `hover` variant; default to `auto` on touch |
| 32 | `gauge` per-frame SVG mutation | Recomputes SVG path every rAF → jank on low-end | Throttle ~30 fps or animate needle via CSS `transform`; honor `prefers-reduced-motion` |
| 33 | `navigation` close/collapse/mobile-menu buttons | 32–40 px; sticky navbar jank on iOS; indicator drift on rotate | Bump to ≥ `size-11` / `min-h-11`; add safe-area padding to drawer + navbar top; re-listen `resize`/`orientationchange` for indicator |
| 34 | `tabs` indicator layout-thrash; no swipe | `width`/`height` animation; no swipe gesture | Animate `transform: scaleX/scaleY` with origin; optionally add swipe-to-change-tab on `TabsContent` with `touch-action: pan-y` |
| 35 | `textarea` auto-resize per keystroke | `getComputedStyle` + `overflowY` mutation per keystroke | Throttle via `requestAnimationFrame` or use `ResizeObserver`; link `<label htmlFor>` to `<textarea id>` in `labelPosition="left"` |
| 36 | `switch` `transition-all` | Animates size (layout) | Scope transitions to `transform, background-color, border-color` |
| 37 | `card` interactive-only-cursor | `cursor-pointer` without `role`/`tabIndex`/`onKeyDown` for keyboard+touch activatable; no `touch-action` for drag | Add `role="button" tabIndex={0}` + Enter/Space handler when `interactive`; add `touch-action: none` on `dragged` |
| 38 | `input`, `select`, `pagination`, etc. focus rings | `:focus-visible` only; hard to see on iOS tap | Add `focus:ring-2 ring-ring/40` alongside `focus-visible:` so tap-focus is always visible |
| 39 | `stepper`, `carousel`, `payoff-diagram` animations | `transition-all`; non-GPU props; no `prefers-reduced-motion` guard | Scope transitions; add `motion-reduce:` utilities; test on low-end iPad mini |
| 40 | `greeks-display` tooltip labels | `cursor-help` + tiny text hit area | Gate `cursor-help` behind `@media (hover: hover)`; add `min-h-[44px] px-1 -mx-1` hit-slop on label span |

### P3 — Documentation only

| # | Component(s) | Note |
|---|---|---|
| 41 | `grid`, `flex`, `container`, `field`, `label`, `typography`, `visually-hidden`, `trend-indicator`, `mini-bars`, `sparkline`, `skeleton`, `spinner`, `segmented-progress`, `separator`, `badge`, `avatar`, `breakeven-badges`, `option-symbol-badge`, `animated-number`, `animated-chevron`, `empty-state`, `expiry-badge`, `greeks-decay-chart`, `kbd`, `iv-chart`, `progress` | Presentational — no interactive surface. Document that consumers must still provide ≥ 44 px tap targets when wrapping them in clickable surfaces, and provide guidance on responsive reflow (`grid-cols-12` on a 375 px screen is a usability trap; recommend `cols={1}` default + responsive overrides via `className`). |

---

## Detailed findings — Batch 1 (components 1–15)

### accordion — ⚠️ Minor issues
**File:** `src/components/accordion/index.tsx`
- `AccordionTrigger` (`accordionTriggerVariants`): `hover:underline` (decoration never appears on touch); `py-4 text-sm` ~34 px, `sm` ~26–28 px, `lg` ~40 px — all **below 44 px**.
- Chevron is `pointer-events-none` (correct) and sized via `chevronSizeVariants`.
- `AccordionContent` uses `overflow-hidden` + `animate-accordion-up/down` (height animation — layout-thrashing on low-end iPads; no `will-change`).
- **Fixes:** `min-h-[44px]` on `accordionTriggerVariants`; replace `hover:underline` with `active:underline`; animate via `grid-template-rows` or add `will-change: height` + `prefers-reduced-motion` guard; document `lg` as the touch-default size.

### alert — ⚠️ Minor issues
**File:** `src/components/alert/index.tsx`
- `AlertClose` (`alertCloseVariants`): `absolute right-3 top-3 rounded-[var(--radius-sm)] p-1` wrapping `<X className="size-4" />` → ~24×24 px hit area. `opacity-70 hover:opacity-100` is hover-only.
- Uses `:focus` (not `:focus-visible`) on the ring — noisy but visible on tap.
- **Fixes:** `AlertClose` → `absolute right-1 top-1 flex size-11 items-center justify-center rounded-[var(--radius-sm)] p-2.5`; replace hover-opacity with `data-[state]`/always-visible + `active:` opacity; switch ring to `focus-visible:ring-2`.

### alert-dialog — ⚠️ Minor issues
**File:** `src/components/alert-dialog/index.tsx`
- `AlertDialogContent`: `fixed ... left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[calc(100%-2rem)] sm:max-w-lg p-6` — **no safe-area insets** → clip on notched iPhone; landscape iPhone collides with Safari URL bar.
- Overlay is `fixed inset-0` (no `overscroll-behavior` → background scroll bleed).
- `AlertDialogAction`/`AlertDialogCancel` use default `md` button = 36 px. Footer `gap-2` is borderline.
- Animations use `zoom-in-95`/`fade-in-0` (GPU-friendly ✅).
- **Fixes:** Add `pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[env(safe-area-inset-top)]`; use `top-[50dvh]` + `max-h-[calc(100dvh-2rem)] overflow-y-auto`; `overscroll-behavior: contain` on content/overlay; default footer buttons to `size="lg"` (44 px); bump footer `gap` to `gap-3`.

### animated-chevron — ✅ N/A presentational
Pure SVG with `pointer-events-none`; no interactive surface. Consumer must wrap in ≥ 44 px target if made clickable.

### animated-number — ✅ N/A presentational
Render-only; `aria-live="polite"`; honors `prefers-reduced-motion`. No touch concerns. (Minor: flash uses `bg-*` transitions — if enabled, add `will-change: background-color`.)

### avatar — ✅ N/A presentational
No click/hover. `xs`/`sm` (24–32 px) are far below tap minimum if made clickable — document the consumer's responsibility.

### badge — ✅ N/A presentational
Pure `<span>`; `:hover` only on anchor descendants (`[a&]:hover`). `size="small"` is an 8 px dot — must not be used as a tap target.

### breadcrumb — ⚠️ Minor issues
**File:** `src/components/breadcrumb/index.tsx`
- `BreadcrumbLink`: `hover:text-foreground` (no `active:`; no `min-h`); inline text typically < 22 px tall.
- `BreadcrumbEllipsis`: `h-9 w-9` (36 px) — **below 44 px**.
- `BreadcrumbList`: `gap-1.5` (6 px) mobile — adjacent links mis-tap risk.
- Responsive variant (`useResponsiveBreadcrumb`) reads `window.innerWidth` (not `matchMedia`) → SSR flash + no orientation/zoom response.
- **Fixes:** `BreadcrumbLink` → `min-h-[44px] py-2 inline-block`; `BreadcrumbEllipsis` → `size-11`; mobile `gap-2 min`; replace `window.innerWidth` with `window.matchMedia(\`(min-width:${breakpoint}px)\`).addEventListener("change", …)`; add `active:text-foreground`.

### breakeven-badges — ✅ N/A presentational
Row of badges with `role="list"`/`role="listitem"`. No interactions.

### button — ⚠️ Minor issues
**File:** `src/components/button/index.tsx`
- Sizes (`buttonVariants`): `xs` 28 px, `sm` 32 px, `md` 36 px, `lg` 44 px, `xl` 52 px. **`md` (the default) is 36 px — non-compliant.**
- Icon-only `xs/sm/md` (28/32/36 px) below HIG.
- `colorStyle: "text"`/`"link"` have only `hover:bg-primary/15`/`hover:underline` — no `active:` → no tap feedback.
- `active:scale-[0.98]` (transform ✅); `transition-all` (broad — may animate layout).
- **Fixes:** Raise `md` to `h-11` (44 px) for primary actions, OR document `lg` as touch-required; add `active:bg-primary/25 active:underline` to `text`/`link`; scope `transition-all` → `transition-[background-color,border-color,color,box-shadow,transform]`; document icon-only `sm`/`md` as desktop-only.

### card — ✅ N/A presentational (interactive opt-in)
- Default non-interactive.
- `interactive: true` adds `cursor-pointer` + `before:` state layer + `hover:before:opacity-[0.08]` + `active:before:opacity-[0.1] active:scale-[0.99]` + `focus-visible:ring-2`. Has both `:hover` and `:active` so touch users get feedback.
- `dragged: true` uses `shadow-xl scale-[1.02] z-50`; no `touch-action` → may fight iOS scroll during drag.
- **Fixes:** When `interactive`, add `role="button" tabIndex={0}` + Enter/Space `onKeyDown` so it's keyboard/touch+AT operable (currently `cursor-pointer` alone doesn't make it activatable); add `touch-action: none` to the `dragged` variant; document that inner tap targets must still meet 44 px.

### carousel — ⚠️ Minor issues
**File:** `src/components/carousel/index.tsx`
- Uses `embla-carousel-react` (touch swipe ✅; Embla handles `touch-action` on the viewport).
- `CarouselPrevious`/`CarouselNext`: `Button iconOnly` default `size="md"` → 36 px; positioned `left-2`/`right-2` (thumb-reachable).
- `CarouselIndicators`: dots `size-2` (8 px), lines `h-1 w-6`, numbers `size-6` — **all far below 44 px**. `hover:bg-muted-foreground/50` with no `:active`.
- Root handles `onKeyDownCapture` (arrows/Home/End) and `tabIndex={0}` — keyboard-only path; touch path is swipe + arrow buttons (✅).
- `CarouselItem` has `motion-reduce:transition-none` (✅); `transition-all` on indicators is broad.
- **Fixes:** Default `CarouselPrevious/Next` to `size="lg"` or `min-h-11 min-w-11`; wrap each indicator button in a `size-11 flex items-center justify-center` hit-slop and keep the visual small; add `active:bg-muted-foreground/70`; add `[touch-action:pan-y]` to the viewport so vertical page scroll isn't hijacked (verify Embla's default); consider `scroll-snap` + native horizontal scroll as reduced-motion fallback; replace `transition-all` with `transition-[background-color,transform,width]`.

### checkbox — ⚠️ Minor issues
**File:** `src/components/checkbox/index.tsx`
- `stateLayerSizeVariants`: `sm: size-9` (36 px), `md: size-10` (40 px), `lg: size-12` (48 px) — `md`/`lg` meet/beat HIG; `sm` is slightly below. Visual box is 16–24 px but the *state layer* is the tap target (correct MD3 pattern).
- Ripple uses `onMouseDown={onTriggerRipple}` — **mouse-only** (cosmetic).
- `hover:bg-foreground/[0.08]`, `focus-within:bg-foreground/10`, `active:bg-foreground/10` — has `:active` (touch feedback ✅).
- `disabled:opacity-38` uses an invalid default Tailwind token — may silently not apply.
- **Fixes:** Replace `onMouseDown` with `onPointerDown` (cosmetic parity); fix `opacity-38` → `opacity-[0.38]`; bump `sm` state layer to `size-10` or document `sm` as desktop-only. (Otherwise this is the best-designed interactive component in the batch.)

### chip — ❌ Not touch-friendly
**File:** `src/components/chip/index.tsx`
- Chip body (`chipVariants`): `h-8` (md)=32 px, `h-7` (sm)=28 px, `h-9` (lg)=36 px — **all < 44 px**.
- Dismiss (`chipDismissVariants`): `size-4` (16 px), `size-[18px]` (md, 18 px), `size-5` (lg, 20 px) — **catastrophically below 44 px**; X icon 12–16 px.
- Dismiss is `<span role="button" tabIndex={0}>` (`handleDismiss` stops propagation) — not a real `<button>`; iOS + SR reliability questionable.
- Nested interactive elements (dismiss inside chip body) → mis-taps hit the chip body and fire `onSelectedChange` instead of dismissing.
- `ChipGroup wrap={false}` uses `overflow-x-auto` — no `-webkit-overflow-scrolling: touch` / `overscroll-behavior` / `touch-action`; `gap-2` (8 px) borderline.
- Chip has `hover:` + `active:` states (touch feedback ✅).
- **Fixes:** Promote dismiss to `<button type="button">`; wrap in `-mr-2 size-11 flex items-center justify-center` hit-slop; add a `touch` chip height (`h-11`); document `lg` as the minimum touch size; for non-wrapping `ChipGroup` add `[-webkit-overflow-scrolling:touch] overscroll-x-contain [touch-action:pan-x]` and `gap-3`; add `active:` state to dismiss (currently `hover:` only); drop bare `cursor-pointer`.

### combobox — ⚠️ Minor issues
**File:** `src/components/combobox/index.tsx`
- **Input font-size (iOS auto-zoom):** `comboboxInputVariants` — `xs: text-xs`, `sm/md: text-sm`, `lg: text-base`, `xl: text-lg`. **`sm`/`md` (default) < 16 px → iOS zooms page on focus.**
- Input heights `sm: h-[1.75rem]` (28 px), `md: h-[2rem]` (32 px) < 44 px.
- `HeadlessComboboxInput` is missing `inputMode="search"`, `enterKeyHint="search"`, `autoComplete="off"`.
- Clear button `<X>` inside `<button>` is a real `<button>` (✅) but width is icon-size-only (12–20 px wide) — **far below 44 px** for `sm`/`md`/`lg`.
- `comboboxOptionsVariants`: `overflow-auto max-h-60` — no `-webkit-overflow-scrolling: touch` / `overscroll-behavior: contain`.
- `comboboxOptionVariants`: `py-1.5 pl-2 pr-8` ~28–30 px tall — **below 44 px**.
- Headless UI handles touch open/select (✅); Portal for z-index (✅); anchor `padding: 8` keeps options off screen edge.
- **Fixes:** **Critical** — set input font ≥ 16 px (`text-base` on `md`/`lg` or `text-[16px]` arbitrary); add `inputMode="search" enterKeyHint="search" autoComplete="off"`; clear button → `min-w-[44px]` centered X (or `size-11` wrapper); option `py-2.5`/`min-h-[44px]`; add `overscroll-behavior: contain` + `[-webkit-overflow-scrolling:touch]` to `comboboxOptionsVariants`; document `sm`/`md` as desktop-only.

---

## Detailed findings — Batch 2 (components 16–30)

### command-palette — ❌ Not touch-friendly
**File:** `src/components/command-palette/index.tsx`
- Keyboard-first architecture: only `cmd+k`/`Ctrl+K` opens it (`keydown` listener ~L80–92, L230–260); no on-screen trigger unless consumer manually renders `CommandPaletteTrigger`.
- `CommandInput` is `h-8 text-sm` (32 px / < 16 px) → sub-min tap + iOS auto-zoom.
- No `inputMode="search"`, `enterKeyHint`, `autocomplete="off"`.
- `CommandItem` rows `px-2 py-1.5 text-sm` → ~28 px tall.
- `DialogContent` wrapper `fixed … top-[18%] w-[90vw] max-w-xl` — **no `env(safe-area-inset-*)`** → notched iPhone clip.
- `CommandList` is `max-h-80 overflow-hidden` delegating to `ScrollArea` (no explicit `-webkit-overflow-scrolling: touch` / `overscroll-behavior`).
- `cursor-default` on items is mouse-only.
- **Fixes:** Render a default `CommandPaletteTrigger` affordance (or document consumer requirement); `CommandItem` → `min-h-[44px] py-2.5`; `CommandInput` → `text-base` + `inputMode="search" enterKeyHint="search" autoComplete="off"`; safe-area padding `pt-[env(safe-area-inset-top)]` on `DialogContent`; ensure the inner `ScrollArea` viewport uses `overscroll-contain` + `[-webkit-overflow-scrolling:touch]`.

### context-menu — ❌ Not touch-friendly
**File:** `src/components/context-menu/index.tsx`
- Radix `ContextMenu` triggers on `contextmenu`/long-press on touch — iOS shows its own selection/callout menu competing with this. No fallback overflow-menu button.
- `ContextMenuItem`/`CheckboxItem`/`RadioItem`/`SubTrigger`: `px-2 py-1.5 text-sm` → ~28 px tap height.
- `cursor-pointer` (mouse-only).
- Focus styling `focus:bg-accent` + `focus-visible:ring-2` — iOS Safari may not fire `focus-visible` on tap.
- `ContextMenuShortcut` (`⌘C`-style) hints are meaningless on touch.
- No `overscroll-behavior` for long menus.
- **Fixes:** Items → `py-2.5 min-h-[44px]`; provide a `DropdownMenu`-based overflow alternative for touch (or auto-swap on `@media (hover: none)`); drop `cursor-pointer`; use `data-[highlighted]` (Radix sets on pointer move) for tap highlight; hide `ContextMenuShortcut` on `@media (hover: none)`.

### data-table — ❌ Not touch-friendly
**Files:** `index.tsx`, `data-table-row-actions.tsx`, `data-table-column-header.tsx`, `data-table-pagination.tsx`, `data-table-toolbar.tsx`
- Row-actions trigger: `Button size="sm" iconOnly h-8 w-8` → 32×32 px.
- Column-header sort `Button` `h-8 px-2` → 32 px.
- Selection `Checkbox` column is `w-12` (48 px) ✓, but checkbox itself ~16–20 px (only the cell is large).
- Pagination nav uses 4 `iconOnly` ghost `Button`s with `size-4` icons.
- Sticky header `sticky top-0 z-[1] bg-background` — iOS sticky jank on momentum scroll.
- Surface is `overflow-hidden` — **non-virtualized wide tables clip horizontally** (no horizontal scroll container).
- Toolbar search `Input size="md"` with no `inputMode`/`enterKeyHint`.
- **Fixes:** Row actions → `h-11 w-11` (or `size="md"` with `min-h-[44px]`); wrap `Table` in `overflow-x-auto` with `overscroll-x-contain` + `[-webkit-overflow-scrolling:touch]`; `overscroll-behavior: contain` on virtualized viewport; toolbar input → `inputMode="search" enterKeyHint="search"` + `text-base`; consider disabling sticky header on `@media (hover: none)`.

### date-picker — ❌ Not touch-friendly
**File:** `src/components/date-picker/index.tsx`
- Trigger sizes: `sm: h-[1.75rem]` (28 px), `md: h-[2rem]` (32 px), `lg: h-[2.25rem]` (36 px) — all below 44 px.
- Clear `<span role="button" tabIndex={0}>` with `p-0.5` + `<X className="size-3.5">` → ~16–20 px hit area; relies on `onKeyDown` for activation (undiscoverable on touch).
- Month/year switcher `<button px-2 py-1>` → ~24 px tall.
- `PopoverContent` is `w-auto p-0` (inner `p-3`) — no `env(safe-area-inset-*)`; wide calendar overflows 375 px viewport with no scroll/wrap strategy.
- **Fixes:** Triggers → `sm/md/lg: h-11` (44 px); clear → real `<button type="button">` with `min-h-11 min-w-11`; month button → `py-2 min-h-[44px]`; `PopoverContent` → add safe-area padding + `max-w-[calc(100vw-1.5rem)]` + internal horizontal scroll when `numberOfMonths > 1` on narrow screens.

### date-time-picker — ❌ Not touch-friendly
**File:** `src/components/date-time-picker/index.tsx`
- Same trigger-size problem: `sm 28 / md 32 / lg 36 px`.
- Same sub-min clear `<span role="button">`.
- **`layout="side-by-side"` is the default**: `flex gap-4` calendar + time — **on a 375 px popover this overflows horizontally** with no `flex-wrap` and no responsive switch to `tabs`. (Worst mobile failure in the batch.)
- Tabs layout uses `TabsList grid w-full grid-cols-2` with `size-4` icons.
- "Now" `Button colorStyle="ghost" size="sm"` likely ~32 px.
- No `env(safe-area-inset-*)` on `PopoverContent`.
- **Fixes:** Default to `tabs` on `max-width: 640px` (via `useMediaQuery`); if `side-by-side` is kept, use `flex-col sm:flex-row` + cap `PopoverContent` to `max-w-[calc(100vw-1.5rem)]`; apply all date-picker fixes (trigger height, clear button, month button, safe-area, popover max-width); ensure "Now" button ≥ 44 px.

### dialog — ⚠️ Minor issues
**File:** `src/components/dialog/index.tsx`
- `dialogCloseVariants`: `absolute right-4 top-4 rounded-[var(--radius-sm)] opacity-70 ... hover:opacity-100` — **no explicit width/height**; with `<X className="size-4">` (~16 px) → ~16 px hit area. Hover-only opacity affordance.
- `position="fullscreen"` (`inset-0 h-full max-h-none rounded-none`) — no `env(safe-area-inset-*)` → content + close button under notch / home indicator.
- Center/top positions `left-1/2 top-1/2 -translate-1/2 -translate-1/2` — no `100vh` usage (avoids the iOS `100vh` bug ✅) but landscape notch can still clip.
- `DialogFooter flex-col-reverse ... sm:flex-row` (primary on top on mobile ✅).
- Overlay `backdrop-blur-sm` can jank on low-end iOS.
- **Fixes:** Close button → `inline-flex size-9 items-center justify-center` (or larger); add safe-area padding to fullscreen content + close button wrapper; drop hover-only opacity (use always-visible + `active:`); optionally disable `backdrop-blur` on `@media (hover: none)` for low-end devices.

### dropdown-menu — ❌ Not touch-friendly
**File:** `src/components/dropdown-menu/index.tsx`
- Items `px-2 py-1.5 text-sm` → ~28 px.
- `cursor-pointer` on items/sub-trigger (mouse-only).
- Submenu via `DropdownMenuSubTrigger` (Radix does open on tap, but chevron is small and easy to mis-tap at 28 px).
- `focus:bg-accent` + `data-[highlighted]:bg-accent` — the latter only fires on pointer move (no highlight on tap).
- `DropdownMenuShortcut` (`⌘…`) hints useless on touch.
- No scroll/`overscroll-behavior` handling.
- **Fixes:** Items → `py-2.5 min-h-[44px]`; hide `DropdownMenuShortcut` on `@media (hover: none)`; drop `cursor-pointer`; use `data-[state=open]`/active state for tap highlight; `overscroll-behavior: contain` on content for long lists.

### empty-state — ✅ N/A presentational
`flex flex-col items-center justify-center gap-4 p-6` — only consumer-supplied `action` slot is interactive.

### expiry-badge — ✅ N/A presentational
Wraps `Badge` with `pulseOnExpiring animate-pulse` (opacity animation, cheap). Not interactive.

### fab — ⚠️ Minor issues
**File:** `src/components/fab/index.tsx`
- `sm: size-10` (40 px) — below HIG; `md: size-14` (56 px) ✓; `lg: size-24` (96 px) ✓.
- Fixed positions (`"bottom-right": "fixed bottom-4 right-4 z-50"`) — flat `1rem` offset, **no `env(safe-area-inset-*)`** → overlaps home indicator / sits too close to edge.
- `active:scale-95` (transform ✅); hover-only shadow/background (cosmetic).
- **Fixes:** `sm: size-11` (44 px) or document `sm` as desktop-only; positions → `bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]` (and equivalents); add `active:` shadow/bg.

### field — ✅ N/A presentational wrapper
`Field`/`FieldLabel`/`FieldDescription`/`FieldError` render `<div>`/`<label>`/`<p>` scaffolding. No own interaction. (If embedded control is an `<input>`, ensure it inherits ≥ 16 px — outside `Field`'s scope.)

### flex — ✅ N/A layout primitive
Pure layout utility mapping CVA props to Tailwind flex classes. Nothing to audit.

### gauge — ⚠️ Minor issues
**File:** `src/components/gauge/index.tsx`
- Pure inline SVG `role="meter" aria-valuenow/min/max` — no interaction.
- `animate` (default `true`) drives a rAF tween calling `setDisplayValue` (state → re-render) up to 60×/s for 400 ms — **not transform/opacity**, re-renders entire SVG subtree each frame → jank on low-end iPads, especially with multiple gauges.
- No `will-change`; SVG path animation not GPU-composited.
- **Fixes:** Throttle to ~30 fps or animate a needle via CSS `transform` + `will-change: transform` instead of mutating path `d` per frame; honor `prefers-reduced-motion` (currently `animate` is unconditional); expose an `animate` prop consumers can disable on touch-heavy dashboards.

### greeks-decay-chart — ✅ N/A presentational
Static SVG `role="img"`, `preserveAspectRatio="none"`. No interaction. Legend dots are `size-1.5` display-only.

### greeks-display — ⚠️ Minor issues
**File:** `src/components/greeks-display/index.tsx`
- Tooltips wrap each label via `<Tooltip><TooltipTrigger asChild><span className="cursor-help …">`. Radix Tooltip opens on focus + hover; on iOS a tap on the span may focus it and trigger the tooltip — but `cursor-help` is mouse-only and there's no visible tap state.
- `labelMuted=false` adds `underline decoration-dotted underline-offset-2` — good discoverability, but the dotted underline is the only visual cue.
- Label hit targets are text-sized (`text-[0.625rem]`–`text-sm`), no `min-h`/padding → ~16–20 px tall — below 44 px, easy to mis-tap especially in dense `inline` layout.
- **Fixes:** Remove `cursor-help` (or gate behind `@media (hover: hover)`); add `inline-flex items-center min-h-[44px] px-1 -mx-1` hit-slop around the span; add `active:bg-accent/50 rounded`; consider `showTooltips={false}` default on touch (or inline glossary below when `@media (hover: none)`).

---

## Detailed findings — Batch 3 (components 31–45)

> **Convention note:** Throughout the codebase, `:focus-visible` rings are used on interactive elements. iOS Safari generally emits `focus-visible` on tap in recent versions, but it's inconsistent — explicit always-on `:focus` or `active:` states are safer. Several batch-3 components rely on `hover:` with no `active:`/persistent-visual alternative.

### grid — ✅ N/A presentational
`Grid`/`GridItem` render only `<div>`/`Slot` layout containers. **Caveat:** Hard `grid-cols-N` with no `sm:`/`lg:` breakpoints causes 12-column layouts to squeeze into 12 narrow slivers on a 375 px iPhone. Document responsive overrides (consumer-supplied `sm:grid-cols-2 lg:grid-cols-12` via `className`).

### hover-card — ⚠️ Minor issues (strong touch-aware foundation)
**File:** `src/components/hover-card/index.tsx`
- **Excellent touch handling:** `useIsTouchDevice()` matches `(hover: none)`, auto-switches to `triggerMode="click"`, shows a close button on touch.
- `HoverCardClose` uses `IconButton` via `closeButtonSizeMap`; **`xs` close maps to an icon button < 32 px** — fails 44 px.
- `HoverCardContent` uses fixed widths (`w-52`…`w-80`) and `style={{ maxHeight: "60vh", overflowY: "auto" }}`. **`60vh` (not `dvh`)** can collide with iOS dynamic toolbars; no `overscroll-behavior: contain` / `-webkit-overflow-scrolling: touch`.
- iPad-with-pointer scenario (`matchMedia("(hover: none)")` returns false → stays on hover) has no press-and-hold or tap-to-toggle path.
- No `env(safe-area-inset-*)` on portaled content — close button could end up under the notch.
- **Fixes:** Bump xs/sm close-button mapping to ≥ `size-11`, or `min-h-11 min-w-11` on `HoverCardClose`; replace `60vh` with `60dvh` (+ `60vh` fallback); add `overscroll-behavior: contain` + `[-webkit-overflow-scrolling:touch]` to scrollable content; add horizontal safe-area padding; expose `forceTriggerMode="click"` for hybrid devices.

### input — ⚠️ Minor issues
**File:** `src/components/input/index.tsx`
- Sizes: `sm: h-[1.75rem]` (28 px), `md: h-[2rem]` (32 px), `lg: h-[2.5rem]` (40 px) — **all below 44 px** for the tap-target input. Fonts `sm/sm/base` → `md` uses `text-sm` (14 px) **< 16 px → iOS auto-zoom**.
- No `inputMode`/`enterKeyHint`/`autocomplete` set by the component (consumers must pass them).
- `focus-visible:border-ring` is the only focus indicator (2 px border color change — barely visible on tap).
- `OutlinedInput` floating-label interaction: `<input>` is `absolute`-position; on iOS the focused input may scroll under the keyboard without `scroll-margin-top`.
- **Fixes:** `lg: "h-11 px-4 text-base"`; document `sm`/`md` as compact non-touch; default `md`/`lg` to `text-base` (16 px); add `focus:ring-2 focus:ring-ring/40` *in addition to* `focus-visible:border-ring`; forward & document `inputMode`/`enterKeyHint`/`autocomplete` recommendations; add `scroll-mt-4` or accept consumer `scrollMargin`.

### input-incrementor — ⚠️ Minor issues (mostly good — touch handlers present)
**File:** `src/components/input-incrementor/index.tsx`
- Correctly wires `onTouchStart`/`onTouchEnd` for hold-to-repeat alongside `onMouseDown`/`onMouseUp` ✅.
- Input is `type="text"` with `inputMode="decimal"` ✅ + `role="spinbutton"` ✅.
- Button sizes: `sm: size-[1.75rem]` (28 px), `md: size-[2rem]` (32 px), `lg: size-[2.5rem]` (40 px) — **all < 44 px**.
- Input height matches buttons (also < 44 px); font `text-sm` for `sm`/`md` → iOS auto-zoom.
- `active:scale-95` only press affordance.
- `enableHold` requires mouseUp/touchEnd on the same element; `onMouseLeave` clears timer (mouse-only) — **no `onTouchCancel`** → a press-then-drag could leave the timer running.
- Buttons use `tabIndex={-1}` (✅ keeps Tab order on input); ArrowUp/Down/Enter/Escape keyboard ✅.
- **Fixes:** Buttons → `sm: size-11 [&_svg]:size-4`, `md: size-11`, `lg: size-12` (≥ 44 px); input font → `text-base` for `md`/`lg`; add `onTouchCancel={handleMouseUp}` to both buttons; bump `+`/`−` icons to `size-5` on `md`+.

### iv-chart — ✅ N/A presentational (with caveat)
- Inline `<svg role="img" aria-label>` ✅; `select-none` prevents text selection on tap.
- Surface cell `<rect>`s have no handlers (purely decorative heatmap).
- `preserveAspectRatio="none"` + fixed `width`/`height` props — doesn't reflow; a 12×12 surface on a 375 px viewport renders sub-1 px cells (invisible and untappable if interactivity is added later).
- Large surfaces emit `console.warn` but still render — first paint may jank on low-end iPhone.
- **Fixes:** None for current usage. If interactivity is ever added: set min-cell-size threshold + virtualization/scroll; add `touch-action: manipulation` on the `<svg>`.

### kbd — ✅ N/A presentational
Styled `<kbd>`; keyboard-shortcut hints are useless on touch-only iOS. Consumers should hide `<Kbd>` clusters on touch (`hidden touch:block` pattern) or render on-screen equivalents.

### label — ✅ N/A presentational
Native `<label>` — tapping focuses the associated control (iOS handles `<label htmlFor>` natively ✅). `text-sm` is fine (non-focusable, no auto-zoom risk). Adjacent label+input `gap-1.5` (6 px) is < 8 px minimum between tappable label and control — minor; consider bumping parent `Input`/`OutlinedInput` container `gap` to `2` (8 px).

### leg-builder-row — ❌ Not touch-friendly
**File:** `src/components/leg-builder-row/index.tsx`
- Packs up to 7 interactive controls in a single `flex gap-2` row with **no responsive wrap, no mobile layout** — on 375 px will overflow or compress below tap-target size.
- Action buttons `Button colorStyle="text" size="xs" iconOnly` with `CopyPlus`/`Trash2` at `size-3.5` — **well below 44 px**; `xs` icon buttons ~28 px.
- Expiry `<select>` `h-8 text-xs` (32 px / 12 px) — below both thresholds.
- `ComboBox inputClassName="h-8 text-xs"` (32 px / 12 px).
- `InputIncrementor size="sm"` → 28 px buttons (see input-incrementor findings).
- No `flex-wrap`/`sm:hidden`/`sm:flex` responsive splits; no `min-w-0` on strike container beyond `min-w-[6rem]` → horizontal overflow likely.
- `focus-within:ring-2 ring-ring/20` only — row has no own focus state.
- **Fixes:** Add a mobile layout (`flex-wrap`/`flex-col sm:flex-row` at `sm:`) — move Buy/Sell + Call/Put to a stacked panel on narrow viewports; replace `size="xs"` on action buttons with `size="sm"` + `min-h-11 min-w-11`; bump `select`/`ComboBox` to `h-11 text-base`; add `flex-wrap`/`@container` query to `legBuilderRowVariants`; add `min-w-0 flex-1` to the strike wrapper to prevent blow-out.

### mini-bars — ✅ N/A presentational
Inline `<svg role="img" aria-label>`; `select-none`. Default `height={16}` — decorative. No interaction.

### multi-select — ⚠️ Minor issues
**File:** `src/components/multi-select/index.tsx`
- Trigger sizes: `xs: min-h-[1.5rem]` (24 px), `sm: 2rem` (32 px), `md: 2.5rem` (40 px), `lg: 3rem` (48 px), `xl: 3.5rem` (56 px). Default `md` is 40 px — **below 44 px**.
- Item rows: `xs 28 / sm 32 / md 40 / lg 48 / xl 56 px` — `md` default is 40 px (< 44 px).
- Clear-all button `rounded-full p-0.5` + `<X className="size-4" />` → ~24 px hit area. Search-clear same pattern.
- Search input is `type="text"` but **no `inputMode`/`enterKeyHint`/`autocomplete`** and fonts `text-xs`/`sm` < 16 px on `sm`/`md` → iOS auto-zoom.
- Keyboard nav comprehensive (Arrows/Enter/Space/Escape/Backspace/Cmd+A) — but items are clickable so there's a touch path ✅.
- `loadMore` sentinel uses `IntersectionObserver` ✅; "Load more" fallback button `text-sm hover:underline` has no `min-h` — fails tap-target.
- `scrollContainer max-h-[300px] overflow-y-auto` — no `overscroll-behavior: contain` / `-webkit-overflow-scrolling: touch`; dropdown can keep scrolling the page behind on iOS.
- `onMouseEnter`/`onMouseLeave` on `MultiSelectItem` drive `highlightedIndex` — **no `onPointerOver`/`onFocus` equivalent** for touch.
- **Fixes:** Default size → `lg` for touch (48 px rows); `md` `min-h-[40px]` → `min-h-[44px]`; clear-all & search-clear → `min-h-11 min-w-11 inline-flex items-center justify-center`; search input → `inputMode="search" enterKeyHint="search" autoComplete="off"` + font ≥ 16 px (`md: h-9 text-base`, `sm: h-8 text-base`); `scrollContainer` → `overscroll-behavior: contain` + `[-webkit-overflow-scrolling:touch]`; `MultiSelectItem` → add `onFocus`/`onPointerOver` for touch-friendly highlight; "Load more" → `min-h-11 px-4 inline-flex items-center`; expose `maxHeight`/`maxWidth` props (e.g. `max-h-[50dvh]`).

### navigation — ⚠️ Minor issues (mobile-aware but gaps remain)
**Files:** `navigation/layout.tsx`, `navbar.tsx`, `navrail.tsx`, `navdrawer.tsx`, `navitem.tsx`, `navsection.tsx`, `premium-nav-group.tsx`
- Mobile-menu button `size-10` (40 px) — **below 44 px**.
- `Navdrawer` uses Radix Dialog with `fixed inset-y-0 left-0 slide-in-from-left` — **no `env(safe-area-inset-top/bottom)` padding** on `navdrawerContentVariants`. Notched iPhone → content underlaps home indicator / status bar.
- `NavdrawerContent` close button `size-8` (32 px). `NavrailCollapseButton` `size-8` (32 px). Both below 44 px.
- `NavItem`: `px-3 py-2.5` + `[&_svg]:size-5` → ~40 px tall — below 44 px.
- `NavItem` uses `hover:` for affordance; `active:scale-[0.98]` ✅. `focus-visible:ring-2 ring-ring ring-offset-2` — ring offset 2 px hard to see on touch.
- `PremiumNavItemWithSubmenu` uses `Accordion` for expand ✅; chevron is part of the trigger (no separated tiny chevron button) ✅.
- `NavSection` collapsible header is `<button>` with `text-xs py-2` → ~32 px — below 44 px.
- Overlay `bg-black/50 backdrop-blur-sm` — backdrop-filter can jank the drawer-open animation on low-end iOS; no `will-change`.
- `navbarVariants sticky top-0 z-40` — iOS sticky navbar can jump with dynamic toolbar; no `supports(position: sticky)`/safe-area-inset for the top.
- `PremiumNavGroup` indicator: `getBoundingClientRect()` in `useEffect` on `activeItem` change — doesn't listen for `resize`/`orientationchange` → indicator drifts after rotation.
- **Fixes:** Bump hit-areas: mobile-menu → `size-11`, close/collapse → `size-9` (or `min-h-11`), `NavItem` `py-2.5` → `py-3` (≈44 px row), `NavSection` header → `min-h-11 py-3`; add `pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]` (+ horizontal for landscape) to `navdrawerContentVariants` and `navbarVariants` sticky top; prefer `h-[100dvh]` / `min-h-dvh` over `inset-y-0` where safe-area is insufficient; `PremiumNavGroup` — listen to `resize` + `orientationchange` (or recompute in `useLayoutEffect` after a rAF); add `will-change: transform` while animating (remove after) to reduce backdrop-blur jank; consider `bg-black/60` without `backdrop-blur` on `@media (max-width: 768px)` for low-end devices.

### option-symbol-badge — ✅ N/A presentational
`<span role="img" aria-label=...>` + `Badge` suffix; color reinforced by `C`/`P` letter + SR label ✅. `Badge` is `px-1` (compact). No interaction. (Consumer note: if wrapped in a link, wrap in a ≥ 44 px target.)

### order-book — ⚠️ Minor issues
**File:** `src/components/order-book/index.tsx`
- `OrderBookRow` has `cursor-pointer`, `hover:bg-accent/30`, `tabIndex={0}`, `onKeyDown` Enter/Space, click wired — touch path ✅.
- Row height: `py-0.5` + `text-xs` ≈ **24 px tall** — well below 44 px. Dense trading ladders traditionally use small rows, but a finger cannot reliably tap a 24 px row.
- `hover:bg-accent/30` is the only hover affordance — no `:active` → no tap visual feedback (besides iOS's native tap highlight, suppressed by some resets).
- `aria-live="polite"` SR summary updates every 1 s via `setTimeout` — on a streaming book this fires constantly; minor CPU burn on low-end iOS.
- `OrderBookRow` is `React.memo`'d with shallow comparator ✅.
- No `overscroll-behavior: contain` on root (uses default block layout — not a scroll container at component level; no scroll concern here).
- **Fixes:** Expose `dense?: boolean` (default false → ≥ 44 px) or add a `(hover: none)` min-height; add `active:bg-accent/60`; replace `cursor-pointer hover:bg-accent/30` with a state visible without hover (`data-[pressed=true]:bg-accent/60` driven by `onPointerDown`); throttle SR announcement to ~3 s on touch / low-power (or only on user-initiated action).

### pagination — ⚠️ Minor issues
**File:** `src/components/pagination/index.tsx`
- Link sizes: `small: h-7 min-w-7` (28 px), `sm: h-8 min-w-8` (32 px), `md: h-9 min-w-9` (36 px), `lg: h-10 min-w-10` (40 px) — **none meet 44×44 at default `md`**.
- `PaginationEllipsis` is non-interactive (N/A).
- `PaginationContent gap-1` (4 px) — below the 8 px minimum between adjacent page buttons.
- `ResponsivePagination` hides page numbers on small screens and shows `current/total` text — good mobile fallback ✅.
- `PaginationPrevious/Next` labels `hidden sm:block` (icon-only on mobile); same size issue.
- `PaginationFirst/Last` same size issue.
- Links/buttons get `active:scale-[0.98]` ✅.
- `focus-visible:ring-[3px] ring-ring/50` — iOS tap inconsistency.
- `PaginationPageSizeSelector` uses Radix `Select` (touch-friendly ✅); trigger inherits size class — same 44 px issue.
- `aria-disabled` + `disabled:pointer-events-none` ✅.
- **Fixes:** Default to `lg` on touch, or `md: h-11 min-w-11`, `lg: h-12 min-w-12`; `paginationContentVariants` `gap-1` → `gap-2` (8 px min); add `min-h-11` to `PaginationPageSizeSelector`'s `SelectTrigger`; consider rendering a tap target for the mobile page-number indicator.

### payoff-diagram — ⚠️ Minor issues (good pointer-events use, but touch gaps)
**File:** `src/components/payoff-diagram/index.tsx`
- Uses **Pointer Events** (`onPointerMove`/`onPointerLeave`) for hover-details tooltip ✅ (right unified API).
- SVG `className="cursor-crosshair touch-none"` — `touch-none` sets `touch-action: none`, which **blocks iOS pinch/scroll over the chart**. Good for draggable chart, **bad when the chart is inside a scrollable page and the user tries to scroll past with a finger starting on the chart** — it traps the gesture.
- Hover tooltip `<text>`/`<rect>` inside SVG with `pointer-events-none` ✅.
- `closestPoint` `reduce` runs on every `pointermove` — O(n) per event; no throttling/rAF → jank on long curves + low-end iPhone.
- `aria-label` set on SVG `role="img"` ✅; hover details in separate `<g role="status">` only render when `hoveredPoint` is set. **On iOS a static tap may not fire `pointermove`** → tooltip **never appears on tap** (no `onClick`/`onPointerDown` pin).
- Breakeven/spot markers visual only (N/A).
- SVG uses fixed `width`/`height` props (default 240×120) — doesn't reflow with container.
- `vectorEffect="non-scaling-stroke"` used everywhere ✅.
- No `will-change` on the moving crosshair `<g>`.
- **Fixes:** Add `onClick`/`onPointerDown` to pin the hovered point on touch when `matchMedia("(hover: none)")` (second tap or `pointerup` off-chart clears); replace `touch-none` with `touch-pan-y` (or expose `touchAction` prop defaulting to `pan-y`); throttle `handlePointerMove` via `requestAnimationFrame`; add `will-change: transform` to the crosshair `<g>` when `showHoverDetails`; add an on-screen "drag to inspect" hint for touch via `aria-label` or visible text on `@media (hover: none)`; expose `onHoverPointChange` so consumers can render a tap-friendlier tooltip outside the SVG.

---

## Detailed findings — Batch 4 (components 46–60)

### popover — ⚠️ Minor issues
**File:** `src/components/popover/index.tsx`
- `PopoverContent` base has no `max-h-[85dvh] overflow-auto` guard — tall content can overflow the viewport.
- `PopoverClose` and `PopoverTrigger` apply only `cn(className)` — tap target entirely consumer-dependent; icon-only triggers (common use) can fall below 44 px.
- Content widths use fixed rem (`w-40`…`w-96`); `xl` (`w-96` = 384 px) can overflow a 375 px iPhone with padding/borders.
- No safe-area handling for edge-anchored popovers.
- **Fixes:** Add `max-h-[85dvh] overflow-auto` to base `popoverContentVariants`; cap width with `max-w-[calc(100vw-1rem)]`; document that icon-only `PopoverTrigger`s should be wrapped in a ≥ 44 px hit area (or add `min-w-11 min-h-11` to the trigger base).

### progress — ✅ N/A presentational (barrel re-export)
The actual sub-components (`linear-progress`, `circular-progress`, `skill-bar`, `progress-group`) are presentational readouts. No interactive surface. (Audit any tooltip-on-hover in `SkillBar` at the sub-file level later.)

### radio — ⚠️ Minor issues
**File:** `src/components/radio/index.tsx`
- State layer sizes: `sm: size-9` (36 px), `md: size-10` (40 px), `lg: size-12` (48 px). Only `sm`/`md` are below 44 px. Visual circle is `size-4`/`5`/`6` but the state layer is the tap target (correct pattern).
- Ripple fired on `onMouseDown` only (`RadioElement`); touch synthesizes mouse events so it works, but `onPointerDown` would be lower-latency.
- `disabled && "opacity-38 pointer-events-none"` uses non-standard Tailwind opacity.
- Group gap is `gap-2` (8 px) ✅.
- **Fixes:** `stateLayerSizeVariants` `sm` → `size-10`, `md` → `size-11` (44 px), or document `sm`/`md` as desktop-only; switch ripple trigger to `onPointerDown`; fix `opacity-38` → `opacity-[0.38]`.

### resizable — ❌ Not touch-friendly
**File:** `src/components/resizable/index.tsx`
- `resizableHandleVariants` `line` direction: `w-px` (1 px) horizontal / `h-px` vertical — **untappable on touch**. Even `bar` is only `w-1.5` (6 px).
- `cursor-col-resize` / `cursor-row-resize` (mouse-only cues).
- Grip hint (`GripVertical`) revealed on `group-hover:opacity` — **invisible on touch** (hover-only affordance).
- Drag relies on `react-resizable-panels` Pointer Events (supports touch) — but 1 px hit area makes it impractical.
- `onPointerDown`/`onPointerUp` wired ✅.
- **Fixes:** Add a touch-friendly minimum handle size: `line` → invisible `before:absolute -inset-2` hit-slop ≥ 44 px while keeping the visual 1 px line; replace `group-hover:opacity-100` on the grip with always-visible (low-opacity) affordance, or reveal on `data-[active]`/focus; consider a visible 24 px grip for mobile or disable resizing below a breakpoint and stack panels vertically; add explicit `touch-none` on the handle to prevent iOS from interpreting the drag as scroll/zoom.

### scroll-area — ⚠️ Minor issues
**File:** `src/components/scroll-area/index.tsx`
- `ScrollBar` base has `touch-none` ✅ (prevents gesture conflicts), but `visibility="hover"` variant (`opacity-0 group-hover:opacity-100`) → **invisible on touch** (no hover).
- `visibility="auto"` is default — on iOS, Radix's scroll-area uses a native momentum-scroll viewport under the hood so the custom scrollbar is largely cosmetic. If consumers rely on the custom bar for horizontal scroll, touch users get no visible indicator.
- No explicit `-webkit-overflow-scrolling: touch` (largely obsolete; Radix handles internally).
- "Load more" manual button relies on `Button` (touch-OK ✅).
- Infinite-scroll sentinel `IntersectionObserver` with `root: viewport` ✅.
- **Fixes:** For `hover` visibility variant, also show on `data-[state=visible]` (already does for `auto`/`scroll`), or add `active:opacity-100` so a tap-and-drag on the track reveals it. Document `hover` visibility as desktop-only; consider defaulting to `auto` or `always` on small viewports; expose a `touchVisibility` prop.

### segmented-progress — ✅ N/A presentational
`role="presentation"` visual bar. Segment `title` attributes provide native tooltips on hover (desktop) but no tap equivalent — acceptable since read-only.

### select — ⚠️ Minor issues
**File:** `src/components/select/index.tsx`
- `selectTriggerVariants`: `xs: h-[1.5rem]` (24 px), `sm: h-[1.75rem]` (28 px), `md: h-[2rem]` (32 px), `lg: h-[2.25rem]` (36 px), `xl: h-[2.75rem]` (44 px). **Only `xl` meets 44 px**; default `md` (32 px) below.
- `SelectItem`: `py-1.5 pl-2 pr-8` + `text-sm` → ~28–32 px tall — below the 44 px row tap target.
- `SelectScrollUpButton`/`SelectScrollDownButton`: `py-1` + `size-4` chevron → ~16–20 px tap target (Radix scroll buttons are auto-repeating desktop conveniences).
- `SelectContent`: `max-h-[min(var(--radix-select-content-available-height),20rem)]` — 20 rem (320 px) tight on landscape phones; `available-height` guard helps.
- No `inputMode`/`enterKeyHint` concerns (no text input). Radix handles touch open/close natively ✅.
- `focus-visible:border-ring` (border only, no ring on `md` trigger) — hard to see on iOS tap.
- **Fixes:** Add a `touch`-aware size or bump defaults: `md` ≥ `h-11`, document `xs`/`sm` as desktop/dense-only; `SelectItem` → `py-2.5` or `py-3` (≥ 40–44 px row); scroll buttons → `min-h-11 min-w-11` centered chevron OR hide on touch (Radix supports direct touch scroll); add `focus-visible:ring-2 ring-ring` on trigger so tap-focus is perceivable.

### separator — ✅ N/A presentational
`decorative` defaults to `true`; visual divider, no interaction.

### sheet — ⚠️ Minor issues (well-engineered for touch overall)
**File:** `src/components/sheet/index.tsx`
- Strong touch support: `touch-none` on content, `useDrag` with `pointer: { touch: true }`, `filterTaps: true`, drag handle (`showHandle`), snap points, velocity/distance thresholds — touch-first ✅.
- **Close button** (`premiumSheetCloseVariants`): `absolute right-4 top-4` + `<X className="size-4">` (16 px), no `min-w`/`min-h` → ~16–24 px hit area. **Hardest part of the sheet to hit.**
- **Drag handle** (`premiumSheetHandleVariants`): `h-1.5 w-12` (6×48 px) — width OK but height only 6 px → tap target tiny. Handle is a visual affordance; content drag zone covers the panel, but a user tapping exactly on the handle gets a tiny target.
- Fixed sizing uses `h-[200px]`/`w-[280px]` etc., **not `dvh`/`dvw` or `env(safe-area-inset-*)`**. On iPhone with the dynamic toolbar, `h-[480px]` bottom sheets collide with home indicator / are obscured. No `pb-[env(safe-area-inset-bottom)]` on bottom sheets.
- `premiumSheetOverlayVariants` is `fixed inset-0` (✅), but content `z-50` + `before:` pseudo-elements extending 200 px beyond the sheet edge could capture touches outside the sheet if `before:pointer-events-none` isn't set.
- Overlay opacity + spring transforms use transform/opacity ✅.
- `overscroll-contain` applied when `scrollLock` set ✅.
- **Fixes:** Close button → `min-w-11 min-h-11 flex items-center justify-center`; consider `right-3 top-3` to clear safe areas; drag handle → `before:absolute -inset-x-4 -inset-y-3` (or wrap in `min-h-11` flex center) so grabbable zone ≥ 44 px tall; add safe-area padding `pt-[env(safe-area-inset-top)]` / `pb-[env(safe-area-inset-bottom)]`; prefer `dvh`/`dvw` or `100dvh` for `full` size instead of `h-full`/`w-full`; add `before:pointer-events-none` to content pseudo-elements; confirm close button + handle already always-visible on touch (they are).

### skeleton — ✅ N/A presentational
`role="status" aria-busy="true"`; `animate-pulse`/shimmer use opacity/`translate-x` (GPU-friendly ✅).

### slider — ⚠️ Minor issues
**File:** `src/components/slider/index.tsx`
- Root `touch-none select-none` ✅.
- **Bar handle is `w-1` (4 px) wide** (`sliderThumbVariants`/`premiumSliderThumbVariants`) — visual is fine per MD3 but the *tap target is also 4 px* → extremely hard to grab on touch.
- Circular handle `size-5` (20 px) with `size-8` (32 px) state layer — still sub-44 px.
- `knobless` variant sets `pointer-events-none` + `w-0 h-0` → whole track becomes the grab surface (✅ most touch-friendly option).
- `showValueIndicator="hover"` relies on `isHovering` (`onPointerEnter`/`onPointerLeave`) — **hover-only, no touch fallback**; never appears on touch unless set to `"always"`.
- State layer on circular handle uses `group-hover:opacity-100` (hover-only).
- Focus styles removed (`focus:outline-none focus-visible:outline-none`) — no replacement ring → no visible focus for keyboard/AT on touch.
- Track heights `xs: h-4` / `sm: h-6` are fine for the track; tiny handle compounds.
- **Fixes:** Add invisible hit-slop on the `Thumb`: `before:absolute inset-[-8px]` (or `-inset-y-0 -left-4 -right-4`) so grabbable zone ≥ 44×44; keep visible bar at `w-1`; default `showValueIndicator` to `"always"` on touch (or detect `pointerType === 'touch'` on `onPointerDown` and force-show the indicator while interacting); restore `focus-visible:ring-2 focus-visible:ring-ring/50` on the Thumb; circular handle state layer → `size-11` and trigger on `active`/`pressed` in addition to `group-hover`.

### sparkline — ✅ N/A presentational
`role="img"` SVG with `pointer-events`-none paths (no handlers); `select-none`. Hover tooltips are consumer responsibility.

### spinner — ✅ N/A presentational
`role="status"` SVG; `animate-spin` + MD3 SVG `<animate>`/`<animateTransform>` are GPU-friendly transforms.

### spread-type-selector — ⚠️ Minor issues (delegated to ToggleGroup)
Wraps `ToggleGroup`/`ToggleGroupItem` with `size="sm"` and `flex-wrap`. Touch-friendliness depends on `ToggleGroup`. `flex-wrap` good ✅. `onValueChange` ✅. If `ToggleGroup`'s `sm` items are < 44 px, touch targets undersized. **Fixes:** Verify `toggle-group` ≥ 44 px item height at `sm` (it's not — see below); consider defaulting to `size="md"` for touch or document `sm` as desktop/dense; ensure ≥ 8 px gap between wrapped rows.

### stepper — ⚠️ Minor issues
**File:** `src/components/stepper/index.tsx`
- `PremiumStepperIndicator` sizes: `sm: size-6` (24 px), `md: size-8` (32 px), `lg: size-10` (40 px).
- `PremiumStepperTrigger` wraps the indicator (real tap target) — no `min-h`/`min-w`; size driven by content (indicator + label). For `sm` with short labels the tap area may be < 44 px tall.
- `premiumStepperTriggerVariants` includes `hover:opacity-80` — only hover affordance.
- `focus-visible:ring-2 ring-ring ring-offset-2 rounded-sm` — iOS tap reliability question.
- Vertical content uses `CollapsiblePrimitive` with `animate-accordion-up/down` (height animation — layout-thrashing on low-end touch during expand/collapse). No `will-change: height`.
- Connector is `w-[2px]` (non-target, fine).
- Trigger is `<button type="button">` ✅ (native touch handling).
- `alternativeLabel` horizontal layout has no wrapping guarantees for long labels on narrow screens.
- **Fixes:** Add `min-h-11` to `premiumStepperTriggerVariants` (or per-size: `sm: min-h-8`, `md: min-h-10`, `lg: min-h-11`); add `will-change: height` to `premiumStepperContentVariants` (or animate `grid-template-rows`/`opacity` instead of `height` to avoid layout thrash); replace/augment `hover:opacity-80` with `active:opacity-80` or `active:bg-accent` for touch press; ensure horizontal step labels can `truncate`/wrap (`min-w-0 truncate`) on narrow viewports.

---

## Detailed findings — Batch 5 (components 61–75)

### strikes-navigator — ⚠️ Minor issues
**File:** `src/components/strikes-navigator/index.tsx`
- Default `rowHeight = 28` px — below the 44 px minimum for tap targets. Each strike row is a `role="option"` div with `cursor-pointer` and `onClick`; rows are zero-gap stacked → mis-taps likely.
- "Jump to strike" `Input` uses `h-6 w-24 text-xs` — **24 px tall, `text-xs` < 16 px → iOS auto-zoom**.
- Header "Strike" label + Jump input container use `py-1` and `gap-0.5` (tight).
- Primary nav is keyboard (`onKeyDown` ArrowUp/Down/Home/End/Enter/Space); no on-screen scroll aid besides the list itself — acceptable since rows are tappable, but tiny rows hurt.
- `ScrollArea` wraps the list; no explicit `-webkit-overflow-scrolling: touch` / `overscroll-behavior: contain`.
- No `touch-action: manipulation` on rows → double-tap delay / iOS callout on long-press; `select-none` present (helps).
- `cursor-pointer` for affordance only; chevrons (`size-2.5`) non-interactive.
- **Fixes:** `rowHeight = 44` (or 48); or add `min-h-[44px]` to rows independent of `rowHeight` and adjust `containerHeight` math; Jump input → `h-9 w-32 text-base` + `inputMode="decimal"` + `enterKeyHint="done"`; add `-webkit-overflow-scrolling: touch` + `overscroll-behavior: contain` to the scroll container; add `[touch-action:manipulation]` to row elements (removes 300 ms delay, disables double-tap zoom); bump header `py-2` and header gap `gap-2`.

### switch — ✅ Touch-friendly
**File:** `src/components/switch/index.tsx`
- Track sizes (sm 24×40, md 32×52, lg 40×64) below 44 px for `sm`/`md`, but the component renders a separate invisible **state layer** (`stateLayerVariants`: `sm size-9`/36, `md size-10`/40, `lg size-12`/48) around the thumb (MD3 pattern). For `lg` the state layer is 48 px — meets Material guidance.
- Radix `SwitchPrimitive.Root` `<button>` → whole track is tappable (effective tap area = track size). `md` is 32×52 px (slightly under 44 px on height) — touch users can still toggle reliably.
- No `:hover`-only behavior; MD3 state layers apply on `:hover`/`:focus`/`:active` but toggle works on pointer-down/click.
- No keyboard-shortcut-only path (Radix Space/Enter natively ✅).
- Uses `transition-all` on track/thumb (animates size of thumb — layout-affecting); thumb translate uses `translate-x` ✅.
- **Fixes:** For `sm`/`md` dense dashboards acceptable; for mobile-first usage default to `lg` and document 44 px guidance; scope transitions to `transform, background-color, border-color` instead of `transition-all` on the thumb.

### table — ⚠️ Minor issues
**File:** `src/components/table/index.tsx`
- Root container `overflow-x-auto` ✅ for horizontal scroll, but **no `-webkit-overflow-scrolling: touch` / `overscroll-behavior-x: contain`** → iOS horizontal scroll fights with browser swipe-back.
- Cells default to `p-3` (~12 px), headers `h-10` (40 px) — below 44 px. In-cell interactive elements inherit the small cell as their hit area; `TableHead` has `[&>[role=checkbox]]:translate-y-[1px]` (checkboxes expected inside) but no min-height guarantee.
- `TableRow` uses `hover:bg-muted/40` only — no tap visual feedback; `data-[state=selected]` is driven externally.
- No `min-w-*` on the table; shrinks to fit + horizontal scroll handles narrow screens (OK but no momentum hint).
- No sticky headers configured here; consumer-applied `sticky top-0` would have the standard iOS sticky-jank.
- **Fixes:** Add `overscroll-behavior-x: contain` + `-webkit-overflow-scrolling: touch` (via `[scroll-touch]` utility) to the `Table` container; bump default cell vertical padding / row min-height to ≥ 44 px when rows host interactive controls (e.g. add an optional `touch` size variant with `h-11` rows + `py-2.5` cells); for checkbox columns provide a fixed-width cell `min-w-[44px]` with centered checkbox so the tap target = full cell.

### tabs — ⚠️ Minor issues
**File:** `src/components/tabs/index.tsx`
- `TabsList` sizes go down to `h-8` (pills sm) and `h-9` (secondary sm) — below 44 px. Triggers are Radix `<button role="tab">` (whole tab tappable) but height still < 44 for smallest variants.
- **No swipe gesture support** — horizontal tab switching via clicking triggers only; iOS users expect swipe-between-tabs (especially `pills`/`underline`). Vertical orientation also has no gesture.
- `TabsIndicator` uses inline `transition: transform/width/height` + `transition-all duration-200`; vertical variant animates `height` (layout-affecting) → jank.
- `MutationObserver` + `ResizeObserver` on the list (`TabsList`) to track the active trigger — runs on every render and on resize; on low-end devices during scroll/animation, this can jank.
- `TabsTrigger` not in this file (Radix defaults apply); `focus-visible` may not show on iOS tap.
- No `touch-action` declared; horizontal tab content/indicator doesn't conflict with iOS swipe-back (no horizontal scroll region).
- **Fixes:** Provide `lg`/`touch` size default for mobile (`h-11` min); optionally add swipe-to-change-tab on `TabsContent` with `touch-action: pan-y`; scope indicator transition to `transform` only (animate `transform: scaleX/scaleY` from an origin instead of changing `width`/`height` directly); use `[touch-action: manipulation]` on triggers (no tap delay); replace `MutationObserver` with state lifted via Radix's `data-state` + a `useEffect` reading the active value once (MutationObserver is heavier than needed on mobile).

### textarea — ⚠️ Minor issues
**File:** `src/components/textarea/index.tsx`
- Base font `text-sm` for `sm`/`md`, only `lg` uses `text-base` → `sm`/`md` (< 16 px) **trigger iOS auto-zoom**.
- No `inputMode`/`enterKeyHint` plumbing — consumers can pass via `...props` (✅ spread) but counter/autoresize machinery doesn't add them.
- `resize-none` hardcoded (✅ acceptable since `autoResize` exists; not relying on desktop resize handle).
- Auto-resize hook reads `window.getComputedStyle` and sets `textarea.style.height` directly per keystroke (`useLayoutEffect`) — synchronous layout read/write on every input event; on low-end mobile keyboards (rapid autocorrect events) → jank.
- `overflowY` toggled between `auto`/`hidden` inline per keystroke — layout-triggering mutation per keystroke.
- `focus-visible:border-ring` (may not appear on iOS tap).
- Required asterisk `aria-hidden`; `<label>` doesn't have `for`/`id` binding — in vertical layout the label wraps the textarea (OK), but in `labelPosition="left"` the label is a sibling of the textarea and **not associated** → touch users with SR lose the association.
- **Fixes:** Default `md` size to `text-base` (16 px); in `labelPosition="left"` link label to textarea with `htmlFor`/`id` (generate id or accept `id` prop and forward); throttle/debounce auto-resize (or use `ResizeObserver` instead of `getComputedStyle` per keystroke); avoid toggling `overflowY` inline per keystroke (set once when entering/exiting the `maxRows` boundary).

### time-and-sales — ⚠️ Minor issues
**File:** `src/components/time-and-sales/index.tsx`
- Rows `py-0.5` + `text-xs` (`timeAndSalesRowVariants`) → ~16–20 px tall — **far below 44 px**. Each row is `role="row"` with `tabIndex={0}`, `onClick`, `onKeyDown` (Enter/Space) — interactive but tiny; adjacent rows stacked no gap → high mis-tap risk.
- `cursor-pointer` + `hover:bg-accent/30` — only hover visual, no press/tap feedback class.
- Scroll container `flex-1 overflow-auto max-h-96` — no `-webkit-overflow-scrolling: touch`, no `overscroll-behavior`, no `touch-action`. Rapid incoming trades cause `el.scrollTop = el.scrollHeight` each render — auto-scroll works but programmatic scroll can interrupt a user's manual touch gesture.
- `isAtBottomRef` threshold 16 px — reasonable.
- No momentum-scroll utility; `overflow-auto` alone works but lacks the hint.
- Visually-hidden `aria-live="polite"` SR summary throttled to 1 s ✅ (low overhead).
- `NumericText` presentational (see typography).
- No `onContextMenu` (no long-press conflict).
- **Fixes:** Increase row padding to `py-2` (or expose a `dense` prop defaulting to off) → ≥ 44 px; add `active:bg-accent/50` (or `[touch-action:manipulation]`) for immediate tap feedback; add `overscroll-behavior: contain` + `-webkit-overflow-scrolling: touch` to scroll container; add `touch-action: pan-y`; guard autoscroll — pause while a `pointerdown`/`touchstart` is in progress on the container.

### time-picker — ❌ Not touch-friendly
**File:** `src/components/time-picker/index.tsx`
- Trigger sizes: `sm h-[1.75rem]` (28 px), `md h-[2rem]` (32 px), `lg h-[2.25rem]` (36 px) — **all below 44 px**. Trigger is a `<button>` (the hit area).
- Time items: `sm h-7` (28 px), `md h-8` (32 px), `lg h-10` (40 px) — **all below 44 px**. Each item is a `<button>`; tapping the right minute on a small column is error-prone.
- Columns `overflow-y-auto` with fixed heights (`h-[160px]`/`[200px]`/`[240px]`) and `scrollbar-thin` — **no snap behavior**, no `-webkit-overflow-scrolling: touch` / `overscroll-behavior: contain`.
- Selection is click-only; scroll-to-selected effect uses `scrollTop = index*itemHeight - clientHeight/2 + itemHeight/2` — programmatic scroll fights user touch scroll.
- Trigger uses `hover:bg-accent` — hover-only affordance, no tap state.
- Font sizes `sm/md text-sm` (< 16 px) — though the trigger is a button (focus-zoom doesn't apply, the buttons inside the popover are also buttons, OK).
- No `enterKeyHint`/`inputMode` relevant (no text input).
- Quick action buttons ("Now"/"Clear") use `Button size="sm"` — likely fails 44 px.
- **No swipe gesture to change columns**; MD3 time pickers usually support drag-to-scroll with snap — this requires tapping each item or scrolling then tapping, which is awkward on touch.
- Popover content relies on Radix Popover; no safe-area-inset handling for bottom-positioned popovers on notched devices.
- **Fixes:** Trigger min-height 44 px (`sm: h-11`); time items `h-11` min; add `scroll-snap-y mandatory` + `[scroll-snap-align:start]` per item (wheel-picker feel); change selection model to "select-on-scroll-stop" via `IntersectionObserver`/`scroll-end` so users don't have to tap after scrolling; `overscroll-behavior: contain` + `-webkit-overflow-scrolling: touch` on each column; replace `hover:bg-accent` with `active:bg-accent`; add `touch-action: pan-y` to the columns so horizontal gestures pass through; honor `env(safe-area-inset-bottom)` on the popover content / viewport for bottom-positioned pickers.

### toast — ⚠️ Minor issues
**File:** `src/components/toast/index.tsx`
- `ToastClose` is `absolute right-2 top-2 p-1` with `opacity-0 group-hover:opacity-100 focus:opacity-100` — **hidden by default, revealed only on hover** (unavailable on touch). Focus-reveal works only after keyboard focus; a touch tap on the toast area doesn't focus the close button → **dismiss affordance unreachable on iOS unless swipe-to-dismiss is enough**. Radix supports `data-[swipe=end]:animate-out` so swipe-to-dismiss works (partial compensation).
- `ToastClose` hit area `p-1` (~4 px) around `X` icon (~20 px) → ~28×28 px — below 44 px.
- `ToastAction` renders `Button size="sm"` — likely below 44 px.
- Viewport `fixed z-[100] ... max-h-screen p-4` and `md:max-w-[420px]` — **does not use `env(safe-area-inset-*)`**. On notched iPhones, `bottom-*` viewport overlaps home indicator; `top-*` collides with the dynamic island.
- `max-h-screen` (Tailwind = `max-height:100vh`) can clip toasts behind the iOS browser chrome.
- Swipe handlers from Radix (touch-capable) ✅.
- Animations use `animate-in`/`animate-out` + transform/opacity (`slide-in-from-*`, `fade-out-80`) — GPU-friendly ✅.
- `ToastViewport` `pointer-events-none` with `[&>*]:pointer-events-auto` ✅ (taps pass through the empty parts of the viewport).
- `toast()` API is imperative; no keyboard-only path ✅.
- `transition-shadow hover:shadow-[var(--elevation-4)]` is hover-only cosmetic — fine.
- **Fixes:** `ToastClose` → always visible on touch / small screens (`opacity-100 sm:opacity-0 sm:group-hover:opacity-100`); bump hit area to `p-2.5 min-w-[44px] min-h-[44px]`; replace `max-h-screen` with `max-h-[100dvh]` (or `max-h-[calc(100dvh-...)]`) and add `padding-top: env(safe-area-inset-top)` / `padding-bottom: env(safe-area-inset-bottom)` per position; ensure `ToastAction` meets 44 px on mobile; keep swipe-to-dismiss (already present) and document it; consider making the whole toast body tappable to dismiss when no action is configured.

### toggle-group — ⚠️ Minor issues
**File:** `src/components/toggle-group/index.tsx`
- Group sizes: `xs h-6`, `sm h-7`, `md h-8`, `lg h-9` — **all below 44 px**. Items inherit group height.
- Item horizontal padding: `xs px-2`, `sm px-2.5`, `md px-3`, `lg px-4` — for short labels ("1D"/"1W") the resulting width is << 44 px; tap targets too small for touch.
- Items separated by `border-r` with **zero gap** — adjacent targets no spacing → high mis-tap risk (zero gap sometimes desirable for segmented control, but combined with sub-44 px heights it's risky).
- `focus-visible:ring-2 ring-offset-1` — may not render on iOS tap.
- `hover:bg-accent` — hover-only visual, no active/press feedback class.
- Radix handles roving tabindex / arrow-key navigation; selection via click/Space — no keyboard-only path ✅.
- No `touch-action` declared (usually fine for segmented control).
- **Fixes:** Add `xl`/`touch` size variant `h-11 min-w-[44px]` for mobile; document ≥ `lg` for touch; add `active:bg-accent/70` (and `data-[state=on]` is already handled) + `[touch-action: manipulation]`; consider `min-w-[44px]` on items regardless of content for larger sizes.

### toolbar — ⚠️ Minor issues
**File:** `src/components/toolbar/index.tsx`
- `toolbarButtonVariants` sizes: `sm size-7` (28 px), `md size-8` (32 px), `lg size-9` (36 px) — **all below 44 px**. Radix `ToolbarPrimitive.Button`; whole button is the hit area → too small.
- Toolbar `gap-0.5` (2 px) — adjacent buttons nearly touching → high mis-tap risk, especially icon-only.
- Each `ToolbarButton` with a `tooltip` prop wraps the button in `Tooltip`/`TooltipProvider` — **tooltips are hover/focus-only** (see tooltip); icon-only buttons lose their accessible name **unless `aria-label` is passed separately**.
- `ToolbarSeparator` `[data-orientation=horizontal] & w-px h-6` — 1 px cosmetic (fine, but hard to perceive on high-DPI mobile).
- `hover:bg-accent hover:text-accent-foreground` — hover-only; no `active:` press feedback.
- `focus-visible:ring-2 ring-offset-1` — may not show on iOS tap.
- `ToolbarLabel` presentational - fine.
- **Fixes:** Add `xl`/`touch` button size `size-11` (44 px); default toolbar to ≥ `lg` on mobile or expose a `density` prop; increase `gap` to `gap-1` (4 px) min or `gap-2` for touch; add `active:bg-accent/80` + `[touch-action: manipulation]`; for icon-only `ToolbarButton` with `tooltip`, **always** pass an `aria-label`; render tooltip text as both `aria-label` and tooltip so SR/touch users get the name; consider a "long-press to show tooltip" pattern on touch (Radix Tooltip opens on focus; add an `onPointerDown`-based long-press fallback).

### tooltip — ⚠️ Minor issues
**File:** `src/components/tooltip/index.tsx`
- Wraps Radix `TooltipPrimitive` (hover/focus-driven by default). On touch devices there is no hover, so a tooltip on an icon-only trigger **will not appear on tap** in iOS Safari (focus doesn't reliably fire on tap for non-input elements). Any component relying on `TooltipTrigger` for the *only* affordance label (e.g., `ToolbarButton tooltip="..."`) is inaccessible on touch.
- `TooltipContent` uses `will-change-[transform,opacity]` ✅ and transform/opacity-only animations ✅ (low-end-friendly).
- No swipe/drag/cursor assumptions.
- `TooltipProvider` `delayDuration` default 200 ms — fine.
- No `onPointerDown`/long-press fallback wired in this wrapper.
- Content `size` variants go down to `xs: px-2 py-1 text-xs` — content is non-interactive (just text), so tap-target sizing doesn't apply; small text fine for a transient tooltip.
- **Fixes:** Document clearly that `Tooltip` is **not** a touch-accessible affordance — any info conveyed by a tooltip must also be available via `aria-label` or a visible label; optionally add a long-press-to-show fallback (wrap `TooltipTrigger` so a `pointerdown` held > 500 ms calls `setOpen(true)`, `pointerup`/`pointerleave` closes); consider rendering the tooltip text into `aria-describedby` on the trigger so SR/touch users get the hint without the visual tooltip.

### typography — ✅ N/A presentational
`Typography` and `NumericText` render `<p>`/`<span>` text-only. No interactive surface; `role="presentation"` on `NumericText`, explicit `aria-label` for colorized values ✅. Minor: `truncate: true` on small screens can hide critical financial values — document that consumers should avoid `truncate` on critical numeric values in mobile dashboards.

### visually-hidden — ✅ N/A presentational
Pure a11y utility (`sr-only` with `focus:not-sr-only` reveal for skip-link patterns). Focus-reveal uses `focus:absolute focus:w-auto focus:h-auto focus:p-2` — when used as a skip link, ensure the revealed element meets 44 px (the `p-2` plus link text often does, but the `as="a"` consumer should add `min-h-[44px]` if text is short). No touch-specific issues.

### container — ✅ Touch-friendly
Pure layout wrapper with responsive `max-width` (sm…2xl/full) and MD3 padding tiers (`tight`/`normal`/`wide`). Mobile default `px-4 sm:px-6 lg:px-8` (16 px sides under 640 px, meets MD3 compact margin ✅). `center: true` default uses `mx-auto` ✅. No interactive surface; no overflow (no momentum concern); no fixed pixel widths breaking at 375 px. Uses `asChild` via Radix `Slot` for semantic wrappers. No safe-area handling (full-bleed container doesn't need it; consumers adding banners should). **Fix (optional):** add `safe` boolean to apply `px-[max(1rem,env(safe-area-inset-left))]` for edge-to-edge mobile layouts where content would otherwise sit under the notch / home indicator.

### trend-indicator — ✅ N/A presentational
`<span>` with icon + colorized numeric text. No handlers, no `cursor-*`, no hover. Color never the only signal — arrow icon (`ArrowUp`/`ArrowDown`/`Minus`) + optional `signed` prefix provide redundant cues ✅. `xs` size uses `text-[0.6875rem]` and `[&>svg]:size-3` — sub-12 px text is hard to read on mobile but this is a density variant for tooltips/table cells (no interaction). No focus styling (not focusable, appropriate). **Fix:** None for touch-friendliness. (Usability note: avoid `xs` for primary mobile content; reserve for dense table cells.)

---

## Appendix — Reusable fix patterns

The following patterns recur across many components. Implementing them once as utilities/recipes will accelerate the remediation roadmap.

### A. Invisible hit-slop for sub-44 px controls
```tsx
// Pattern: keep the visual small, enlarge the touch target via a pseudo-element.
<button className="relative size-4 …">
  <span aria-hidden className="absolute -inset-[12px]" /> {/* +12px slop each side → 40×40 → add more if needed */}
  <X className="size-4" />
</button>
```
Or use Tailwind arbitrary variant on the inner element: `before:absolute before:-inset-y-0 before:-left-4 before:-right-4`.

### B. Safe-area utility helpers (Tailwind config)
Add these as utility classes (or via arbitrary properties):
```css
.pt-safe { padding-top: env(safe-area-inset-top); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.px-safe { padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }
.dvh { height: 100dvh; }       /* with vh fallback */
.min-h-dvh { min-height: 100dvh; }
.max-h-dvh { max-height: 100dvh; }
```
Apply `pt-safe`/`pb-safe`/`px-safe` to fixed-position chrome (modals, sheets, toolbars, FABs, toasts).

### C. iOS-friendly scroll containers
```tsx
<div className="overflow-auto [overscroll-behavior:contain] [-webkit-overflow-scrolling:touch] [touch-action:pan-y]">
  {/* pan-y keeps vertical native scroll while preventing horizontal fight with iOS swipe-back */}
</div>
```

### D. Input ≥ 16 px to avoid iOS auto-zoom
All focus-receiving text inputs/comboboxes/textareas/`select` triggers with `text-sm`/`text-xs` must default to `text-base` (16 px), or use:
```tsx
<input className="text-[16px] sm:text-sm …" />  // 16 px on touch, smaller on larger screens
```
Pair with `inputMode="search|numeric|decimal|email|tel"`, `enterKeyHint="search|done|next|go"`, `autoComplete="off"` where relevant.

### E. Touch-aware size variants (CVA recipe)
```ts
sizeVariants: cva({
  variants: {
    size: {
      xs: "h-6 px-2 text-xs",        // desktop-only — document
      sm: "h-8 px-2.5 text-sm",      // desktop/dense — document
      md: "h-9 px-3 text-sm",       // desktop default
      lg: "h-11 px-4 text-base",    // touch-default 🎯
      xl: "h-12 px-5 text-base",    // touch-primary
    },
  },
  defaultVariants: { size: "md" },
})
```
Either bump the default to `lg` for components used on touch, or expose a `touch` boolean that swaps sizes.

### F. `active:` fallback for hover-only affordances
Replace `hover:`-only state layers with paired `hover:` + `active:` (or `data-[state=open]`/`data-[highlighted]`):
```tsx
// Before
"hover:bg-accent/40"
// After
"hover:bg-accent/40 active:bg-accent/60"
// Or use a state we already drive:
"data-[highlighted]:bg-accent data-[state=open]:bg-accent"
```

### G. `onPointerDown` parity for ripple/dismiss
Replace `onMouseDown` with `onPointerDown` so the cosmetic state fires on mouse, pen, and touch immediately:
```diff
- onMouseDown={onTriggerRipple}
+ onPointerDown={onTriggerRipple}
```
Add `onTouchCancel` whenever you have `onMouseLeave` clearing timers/state, to handle iOS press-then-drag cancel.

### H. Long-press tooltip fallback (for `tooltip` wrapper)
```tsx
let pressTimer: number | undefined
const onPointerDown = () => { pressTimer = window.setTimeout(() => setOpen(true), 500) }
const clearTimer = () => { if (pressTimer) window.clearTimeout(pressTimer) }
```
Wire on the `TooltipTrigger`: `onPointerDown={onPointerDown} onPointerUp={clearTimer} onPointerLeave={clearTimer}`. Also mirror tooltip content into `aria-describedby={id}` so SR/touch users always get the hint.

### I. Wheel-picker scroll-snap (for `time-picker`)
```tsx
<div className="h-[200px] overflow-y-auto [scroll-snap-type:y_mandatory] [overscroll-behavior:contain] [-webkit-overflow-scrolling:touch] [touch-action:pan-y]">
  {items.map(it => (
    <button className="h-11 [scroll-snap-align:start]">{it}</button>
  ))}
</div>
```
Pair with an `IntersectionObserver` to set the selected value when a snapped item reaches the viewport middle.

### J. `prefers-reduced-motion` guard
All height/layout-animating components (accordion, stepper, tabs vertical, payoff diagram tween, gauge) should add:
```tsx
className="motion-reduce:transition-none motion-reduce:animate-none"
```
Or check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and disable `animate` programmatically.

---

## Implementation notes

- **This document is an audit + remediation plan.** No code was modified during the audit pass.
- The remediation roadmap (P0/P1/P2/P3) is ordered by user impact × frequency and is the recommended implementation order.
- Before starting implementation, run `git checkout -b fix/touch-friendliness-p0` and work through P0 items first; each P0 fix has a clear, measurable acceptance criterion (44 px target, ≥ 16 px input font, safe-area handled, no horizontal overflow on 375 px).
- After P0+P1 are complete, run a manual pass on an iPad/iPhone (or Xcode Simulator with iOS Safari) over Storybook to validate. Re-run `npx tsc --noEmit` and `npm run build-storybook` between batches to catch regressions.
- Update `docs/ROADMAP.md` with changelog entries as each priority batch lands.
- Some fixes require coordinated changes across multiple components (e.g., `tooltip` fallback used by `toolbar` and `greeks-display`); implement those foundational changes first to avoid rework.
