# Original icon design system

## Visual thesis

Quiet, balanced rounded outlines complement AgentixUI's shadcn composition, Material-inspired controls, neutral surfaces, and compact financial workspaces.

## Geometry and sizing

- Draw in a 24 × 24 viewBox, with nominal 2-unit strokes and rounded ends/joins.
- Aim for a 2-unit inset. Optical exceptions may extend beyond that inset, but visible strokes must stay inside the viewBox.
- Use simple silhouettes, open interiors, and balanced negative space. Avoid detail that disappears at 14/16 CSS-pixel equivalents.
- Review at 0.875rem, 1rem, 1.25rem and 1.5rem with the normal root font. Check larger root fonts and 200% zoom too.
- Default to 1.5rem presentation dimensions. Controls retain their own sizes; do not enlarge buttons to accommodate artwork.
- Inherit currentColor. Filled dots are permitted for punctuation/details; the family remains an outline family. No gradients, multicolor artwork, embedded images, IDs, or external references.
- Existing AnimatedChevron uses the same 24-unit/2-unit/rounded geometry. Preserve its open/closed animation API and the dedicated Spinner's behavior.

## Semantics

Clear is an eraser, Trash is a disposal bin, and Close is a cross.
Maximize has outward corners, Restore inward corners, Fullscreen adds a frame, and ExternalLink combines an opening frame with a diagonal arrow.
Refresh uses opposing circular arrows; KeepDrawing combines repeat intent with a pen. Finance rolls/transfers must retain labels and use distinct future designs.
VolumeProfile has horizontal bins; ordinary volume/bar charts use vertical bars.
CALL/PUT, long/short, RSI/MACD/Stoch, Auto/Log and currency codes remain textual. A past date does not establish an option lifecycle outcome.

Equivalent legacy icon variants map to a single canonical name, without publishing old aliases. Shape variants with different semantics remain separate.

## Catalog composition

Content: searchable category/keyword catalog, 20-icon pilot, control examples, and size/weight inspection.
Interaction: existing button hover/press/focus states; existing toggle and disclosure transitions; existing loading behavior. Static artwork adds no entrance or decorative animation.
Dark and chart-local themes inherit local foreground tokens, including inside portals.

## Review procedure

First compare the pilot in Button, IconButton, ToggleIconButton, Select, draft-row menus, chart commands and status labels.
Then inspect the full catalog at small and normal sizes. Check optical weight, clipping, distinguishable silhouettes, keyboard discovery, theme contrast and non-color status cues.
Keep the same geometry across sizes for this release; simplify shapes instead of introducing an unreviewed optical-variant API.

Artwork was authored for this library using basic SVG geometry and familiar symbol conventions, without tracing or copying another icon set.

