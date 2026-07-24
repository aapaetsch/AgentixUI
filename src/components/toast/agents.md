# Toast Component

## Title
Toast

## Props
- `PremiumToastProvider`: provider exported from `api.tsx` with `position`, `maxToasts`, `swipeDirection`, and `enableSounds`. It wraps the lower-level provider from `primitives.tsx`.
- `PremiumToastOptions`: extends the base primitive toast options with `priority`, `showProgress`, `undo`, `sound`, and `content`.
- `PromiseOptions` and `PromiseMessages`: describe loading, success, and error payloads for promise-based toast flows.
- Primitive exports from `primitives.tsx`: `Toast`, `ToastViewport`, `ToastIcon`, `ToastContent`, `ToastTitle`, `ToastDescription`, `ToastAction`, and `ToastClose`.
- Hook and imperative APIs from `api.tsx`: `usePremiumToast()` and `premiumToast`.

## Dependencies
- `@radix-ui/react-toast` for the underlying accessible toast primitives and viewport lifecycle.
- `class-variance-authority` for toast shell and viewport variants.
- `lucide-react` for status, close, loading, and undo-related icons.
- `src/lib/utils.ts` for `cn()` class merging.

## Styling Decisions
- This folder now has a split API: `primitives.tsx` contains the low-level toast system and `api.tsx` layers premium conveniences on top. `index.tsx` intentionally re-exports from `api.tsx` only.
- The package root aliases the premium layer as the public default surface: `PremiumToastProvider` becomes `ToastProvider`, `usePremiumToast` becomes `useToast`, and `premiumToast` becomes `toast` in `src/index.ts`.
- Variant styling lives in the primitive layer so both direct primitive usage and premium helpers share the same visual treatment, placement logic, and dismissal behavior.
- Premium features such as undo, promise updates, and optional sound playback are additive wrappers around the primitive store rather than a separate rendering path.

## Maintenance Notes
- Keep the docs aligned with the split between `api.tsx` and `primitives.tsx`. The folder no longer exposes only the basic provider and hook described in older docs; it also exposes premium imperative and promise helpers.
- `PremiumToastProvider` currently forwards to the free provider and accepts `enableSounds`, but sound playback is handled per-toast through the premium options rather than by provider-level global audio orchestration.
- Promise helpers update an existing toast in place. If base toast update semantics change in `primitives.tsx`, retest `premiumToast.promise()` and `usePremiumToast().toast.promise()` together.
- Both imperative and hook APIs still require a mounted provider. When changing provider scoping or store behavior, verify Storybook isolation and multiple-provider scenarios.

## File Structure
- `index.tsx`: public folder entry that re-exports the premium API layer.
- `api.tsx`: premium provider, hook, imperative helpers, and convenience re-exports.
- `primitives.tsx`: store, primitive components, base provider, and low-level types.


