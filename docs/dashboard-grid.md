# DashboardGrid integration

DashboardGrid is a controlled presentation engine exported through the normal `aapaetsch-ui-kit` entrypoint. The component API, constraints, commands, CSS loading and interaction semantics are documented in [the component README](../src/components/dashboard-grid/README.md). Storybook fixtures are under `Layout/DashboardGrid`.

Place the import in a React client boundary. Keep `src/react-server.ts` server-safe: its conditional entrypoint does not export DashboardGrid. Conventional ESM/CJS React SSR is supported, initially at one visible column until container measurement. Load `aapaetsch-ui-kit/globals.css` once. There are no new dependencies or additional grid stylesheet.

The host owns content/data, selection/settings, revision handling, draft Save/Cancel and opaque configuration. Send only `{id,width,height}` into the grid; merge returned geometry/order into the host draft by stable ID. Never treat measured placement or responsive projection as persisted coordinates. There is no v1 serializer change, localStorage, provider request or financial calculation in this component.

The host can route its own tap menu into `DashboardGridHandle.execute` with the same move/resize commands and use `onAnnouncement` to integrate accessible messages. The built-in live region remains available. All width choices remain accessible in the built-in tap menu on narrow containers; pointer projection does not discard canonical geometry. No-op commands, measurement and orientation changes emit no save callback.

Host cards should reserve space at their upper right for edit controls while editing. Their own internal scrolling, chart interactions, links, menus, dialogs and warnings remain independently owned. Keep `renderItem` stable while its captured content is unchanged, and update its identity when settings/data need a render. Reordering/resizing preserves child instances by stable ID. Avoid coupling data effects to presentation geometry.

The local candidate review in `.dashboard-grid-validation/PUBLICATION-REVIEW.md` records exact package/source identity, build and browser results, scope audit and remaining publication/consumer gates. DashboardGrid has not been published by this implementation task. Browser emulation is not physical iPad Safari validation.
