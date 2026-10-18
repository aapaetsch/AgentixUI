export interface AxisBadge {
  id: string;
  y: number;
  text: string;
  color: string;
  priority: number;
}
/** Highest priority survives overcrowding; stable IDs break ties. */
export function layoutAxisBadges(
  badges: AxisBadge[],
  top: number,
  height: number,
  spacing = 19,
): AxisBadge[] {
  const limit = Math.max(0, Math.floor(height / spacing));
  const selected = badges
    .filter((b) => b.y >= top && b.y <= top + height)
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))
    .slice(0, limit)
    .sort((a, b) => a.y - b.y || a.id.localeCompare(b.id));
  selected.forEach((b, i) => {
    b.y = Math.max(
      top + spacing / 2,
      b.y,
      i ? selected[i - 1].y + spacing : -Infinity,
    );
  });
  for (let i = selected.length - 1; i >= 0; i--)
    selected[i].y = Math.min(
      selected[i].y,
      top + height - spacing / 2,
      i < selected.length - 1 ? selected[i + 1].y - spacing : Infinity,
    );
  return selected;
}
