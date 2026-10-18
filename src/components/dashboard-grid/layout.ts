/** Canonical four-column width, independent of the current container projection. */
export type DashboardGridWidth = 1 | 2 | 3 | 4;
export type DashboardGridColumns = 1 | 2 | 4;

/** Presentation geometry only. Product settings and persistence belong to the host. */
export interface DashboardGridItem {
  id: string;
  width: DashboardGridWidth;
  /** Integer CSS pixels, 240..720 inclusive in steps of 40. */
  height: number;
}

export interface DashboardGridPlacement {
  id: string;
  /** Zero-based row/column in canonical reading order. */
  row: number;
  column: number;
  span: number;
  height: number;
  rowHeight: number;
  top: number;
}

/** All indices are final zero-based positions in the canonical item array. */
export type DashboardGridCommand =
  | { type: "move"; id: string; toIndex: number }
  | { type: "resize"; id: string; width: DashboardGridWidth; height: number };

export const dashboardGridConstraints = Object.freeze({
  columns: 4, gutter: 12, maximumItems: 24,
  minimumHeight: 240, maximumHeight: 720, heightStep: 40,
  activationDistance: 8, minimumTarget: 44,
});

/** Reject invalid persisted geometry; never silently normalize controlled inputs. */
export function validateDashboardGridItems(items: readonly DashboardGridItem[]): void {
  if (!Array.isArray(items) || items.length > 24) throw new Error("DashboardGrid requires an array of at most 24 items.");
  const ids = new Set<string>();
  for (const item of items) {
    if (!item || typeof item.id !== "string" || !item.id.trim() || ids.has(item.id)) throw new Error("DashboardGrid item IDs must be nonempty and unique.");
    if (![1, 2, 3, 4].includes(item.width) || !Number.isInteger(item.height) || item.height < 240 || item.height > 720 || item.height % 40 !== 0) throw new Error(`Invalid DashboardGrid size for ${item.id}: width must be 1..4 and height 240..720 in steps of 40.`);
    ids.add(item.id);
  }
}

export function dashboardGridColumns(containerWidth: number): DashboardGridColumns {
  if (!Number.isFinite(containerWidth) || containerWidth < 0) throw new Error("DashboardGrid container width must be finite and nonnegative.");
  return containerWidth >= 1100 ? 4 : containerWidth >= 640 ? 2 : 1;
}

export function projectDashboardGridWidth(width: DashboardGridWidth, columns: DashboardGridColumns): number {
  if (![1, 2, 3, 4].includes(width) || ![1, 2, 4].includes(columns)) throw new Error("Invalid DashboardGrid width or columns.");
  return columns === 4 ? width : columns === 2 ? width <= 2 ? 1 : 2 : 1;
}

/** Sequential rows; never backfill holes, overlap, or create a second reading order. */
export function packDashboardGrid(items: readonly DashboardGridItem[], columns: DashboardGridColumns): DashboardGridPlacement[] {
  validateDashboardGridItems(items);
  if (![1, 2, 4].includes(columns)) throw new Error("DashboardGrid columns must be 1, 2 or 4.");
  const result: DashboardGridPlacement[] = [];
  let row = 0, column = 0;
  for (const item of items) {
    const span = projectDashboardGridWidth(item.width, columns);
    if (column + span > columns) { row++; column = 0; }
    result.push({ id: item.id, row, column, span, height: item.height, rowHeight: 0, top: 0 });
    column += span;
  }
  const heights = new Map<number, number>();
  for (const item of result) heights.set(item.row, Math.max(heights.get(item.row) ?? 0, item.height));
  let top = 0;
  for (let index = 0; index <= row; index++) {
    const height = heights.get(index) ?? 0;
    for (const item of result) if (item.row === index) { item.rowHeight = height; item.top = top; }
    top += height + dashboardGridConstraints.gutter;
  }
  return result;
}

/** One constraint path for host commands, tap controls, keyboard and pointer commits. */
export function applyDashboardGridCommand(items: readonly DashboardGridItem[], command: DashboardGridCommand): DashboardGridItem[] {
  validateDashboardGridItems(items);
  const index = items.findIndex(item => item.id === command.id);
  if (index < 0) throw new Error(`Unknown DashboardGrid item: ${command.id}`);
  // Emit only the presentation contract, never opaque product fields/settings.
  const next = items.map(({ id, width, height }) => ({ id, width, height }));
  if (command.type === "move") {
    if (!Number.isInteger(command.toIndex) || command.toIndex < 0 || command.toIndex >= items.length) throw new Error("DashboardGrid move target is out of bounds.");
    const [item] = next.splice(index, 1); next.splice(command.toIndex, 0, item);
  } else if (command.type === "resize") {
    next[index] = { id: command.id, width: command.width, height: command.height };
  } else throw new Error("Unknown DashboardGrid command.");
  validateDashboardGridItems(next);
  return next;
}

/** Pointer-only snapping. Controlled input validation remains strict. */
export function snapDashboardGridHeight(height: number): number {
  if (!Number.isFinite(height)) throw new Error("DashboardGrid resize height must be finite.");
  return Math.max(240, Math.min(720, Math.round(height / 40) * 40));
}

export interface DashboardGridHitRect { id: string; left: number; top: number; width: number; height: number }
export interface DashboardGridInsertion { toIndex: number; targetId: string; position: "before" | "after" }

/** Select an insertion relative to a real card, never a persisted x/y placement. */
export function findDashboardGridInsertion(rects: readonly DashboardGridHitRect[], point: { x: number; y: number }): DashboardGridInsertion | null {
  let closest: DashboardGridHitRect | undefined, distance = Infinity;
  for (const rect of rects) {
    const dx = Math.max(rect.left - point.x, 0, point.x - rect.left - rect.width);
    const dy = Math.max(rect.top - point.y, 0, point.y - rect.top - rect.height);
    const score = dx * dx + dy * dy;
    if (score < distance) { closest = rect; distance = score; }
  }
  if (!closest) return null;
  const after = point.y > closest.top + closest.height || point.y >= closest.top && point.x >= closest.left + closest.width / 2;
  return { targetId: closest.id, position: after ? "after" : "before", toIndex: rects.indexOf(closest) + (after ? 1 : 0) };
}
