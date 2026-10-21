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
  obstacles: readonly {y: number; height: number}[] = [],
): AxisBadge[] {
  if (obstacles.length) {
    const placed: AxisBadge[] = [], minimum = top + spacing / 2, maximum = top + height - spacing / 2;
    if (minimum > maximum) return [];
    for (const badge of [...badges].sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))) {
      if (badge.y < top || badge.y > top + height) continue;
      const positions = [Math.max(minimum, Math.min(maximum, badge.y)), minimum, maximum,
        ...obstacles.flatMap(obstacle => [obstacle.y - (obstacle.height + spacing) / 2 - 2, obstacle.y + (obstacle.height + spacing) / 2 + 2]),
        ...placed.flatMap(other => [other.y - spacing, other.y + spacing])];
      const y = positions.filter(value => value >= minimum && value <= maximum && placed.every(other => Math.abs(other.y - value) >= spacing - .01) && obstacles.every(obstacle => Math.abs(obstacle.y - value) >= (obstacle.height + spacing) / 2 + 1))
        .sort((a, b) => Math.abs(a - badge.y) - Math.abs(b - badge.y) || a - b)[0];
      if (y != null) placed.push({...badge, y});
    }
    return placed.sort((a, b) => a.y - b.y);
  }
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
