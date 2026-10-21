import type {MarketChartTheme, MarketTime} from '../core';

export interface MovingAverageLabel {
  id: string;
  label: string;
  shortLabel?: string;
  color: string;
  value: number | null;
  time?: MarketTime;
  status: string;
  /** Null means undefined under this scale (e.g. nonpositive log value), never zero. */
  anchorY: number | null;
  anchorX: number | null;
  /** Domain classification from the price scale, not inferred from label margins. */
  scaleEdge?: 'inside' | 'above' | 'below' | 'undefined';
  scaleIssue?: string;
}
export interface PlacedMovingAverageLabel extends MovingAverageLabel {
  y: number;
  edge?: 'above' | 'below' | 'undefined';
  displaced: boolean;
}

/** Retain every row. Overflow has an explicit bounded scroll layout, not price positions. */
export function layoutMovingAverageLabels(labels: readonly MovingAverageLabel[], top: number, height: number, rowHeight = 32): {overflow: boolean; labels: PlacedMovingAverageLabel[]} {
  const available = Math.max(0, height), minimum = top + rowHeight / 2, maximum = top + available - rowHeight / 2;
  const overflow = labels.length * rowHeight > available;
  const sorted = labels.map((label, index) => ({...label, index, edge: label.value == null || label.scaleEdge === 'inside' ? undefined : label.scaleEdge ?? (label.anchorY == null ? 'undefined' as const : label.anchorY < top ? 'above' as const : label.anchorY > top + available ? 'below' as const : undefined)}))
    .sort((a, b) => (a.anchorY ?? Infinity) - (b.anchorY ?? Infinity) || a.index - b.index);
  const placed: PlacedMovingAverageLabel[] = sorted.map((label, index) => ({...label, y: overflow ? top + (index + .5) * rowHeight : Math.max(minimum, Math.min(maximum, label.anchorY ?? maximum)), displaced: false}));
  if (!overflow) {
    // Isotonic least-squares projection: y[i]-i*rowHeight must be nondecreasing.
    // Pool adjacent violations, then bound each block. This preserves exact anchors
    // when feasible and minimizes total squared displacement, rather than pushing
    // an entire collision group downward from its first item.
    const blocks: Array<{from: number; to: number; sum: number; count: number}> = [];
    placed.forEach((label, index) => {
      blocks.push({from: index, to: index, sum: (label.anchorY ?? maximum) - index * rowHeight, count: 1});
      while (blocks.length > 1) {
        const a = blocks[blocks.length - 2], b = blocks[blocks.length - 1];
        if (a.sum / a.count <= b.sum / b.count) break;
        blocks.splice(-2, 2, {from: a.from, to: b.to, sum: a.sum + b.sum, count: a.count + b.count});
      }
    });
    const upper = maximum - Math.max(0, placed.length - 1) * rowHeight;
    blocks.forEach(block => {
      const value = Math.max(minimum, Math.min(upper, block.sum / block.count));
      for (let i = block.from; i <= block.to; i++) placed[i].y = value + i * rowHeight;
    });
  }
  placed.forEach(label => {label.displaced = overflow || label.anchorY == null || Math.abs(label.y - label.anchorY) > .5;});
  return {overflow, labels: placed};
}

/** Numeric precision stays independent of pixel positions and scale-transformed tick units. */
export function movingAverageValueText(value: number | null): string {
  if (value == null) return '—';
  const text = Number(value.toPrecision(8)).toString();
  if (text.length <= 9 && (value === 0 || Math.abs(value) >= .001 && Math.abs(value) < 1e7)) return text;
  // Reserve a character for edge/displacement marks; never truncate a sign/exponent.
  for (let digits = 5; digits >= 0; digits--) {
    const scientific = value.toExponential(digits);
    if (scientific.length <= 9) return scientific;
  }
  return value.toExponential(0);
}

/** Owned by the engine: no host Canvas patches, private measurements or value calculations. */
export class MovingAverageAxisLayer {
  private root: HTMLDivElement;
  private signature = '';
  constructor(surface: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'pointer-events-none absolute inset-0 z-10 overflow-hidden';
    this.root.dataset.movingAverageAxis = '';
    surface.appendChild(this.root);
  }
  clear(): void {if (this.signature) {this.root.replaceChildren(); this.signature = '';}}
  destroy(): void {this.root.remove();}
  update(labels: MovingAverageLabel[], geometry: {axisX: number; top: number; height: number; width: number; fontSize: number; paneId?: string; dedicated?: boolean}, theme: MarketChartTheme): void {
    const signature = JSON.stringify([labels, geometry, theme]);
    if (signature === this.signature) return;
    this.signature = signature;
    this.root.classList.toggle('z-30', !!geometry.dedicated);
    this.root.classList.toggle('z-10', !geometry.dedicated);
    const active = this.root.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.endpointLabel : undefined;
    const overflowFocused = document.activeElement === this.root.querySelector('[data-endpoint-overflow]');
    const scrollTop = this.root.querySelector('[data-endpoint-overflow]')?.scrollTop ?? 0;
    this.root.replaceChildren();
    if (!labels.length || geometry.height <= 0) return;
    // Dedicated gutters grow with font size. At extreme font/viewport ratios,
    // wrap complete numeric text rather than clipping it or shrinking the font.
    // First fit without a scrollbar. Only overflowing lists reserve its lane;
    // a scrollbar budget must not turn fitting single-line values into tall rows.
    const heightFor = (scrollbar: boolean) => {
      const numericLines = Math.ceil(10 / Math.max(1, Math.floor((geometry.width - (scrollbar ? 28 : 12)) / (geometry.fontSize * .65))));
      return geometry.dedicated ? Math.max(20, Math.ceil(geometry.fontSize * 1.3 * numericLines + 8)) : Math.max(20, geometry.fontSize + 10);
    };
    let rowHeight = heightFor(false), layout = layoutMovingAverageLabels(labels, geometry.top, geometry.height, rowHeight);
    if (layout.overflow) {rowHeight = heightFor(true); layout = layoutMovingAverageLabels(labels, geometry.top, geometry.height, rowHeight);}
    const region = document.createElement('div');
    region.setAttribute('role', 'region');
    const group = geometry.dedicated ? `${geometry.paneId ?? 'chart'} value` : 'moving-average';
    region.setAttribute('aria-label', layout.overflow ? `All ${labels.length} ${group} endpoint boxes. Scroll for every row; list positions are not price coordinates.` : `${group} visible-window endpoint boxes`);
    region.dataset.endpointPane = geometry.paneId ?? 'price';
    region.style.color = theme.text;
    region.style.left = `${geometry.axisX + 1}px`;
    region.style.width = `${Math.max(1, geometry.width - 2)}px`;
    region.style.fontSize = `${geometry.fontSize}px`;
    region.className = 'pointer-events-auto absolute font-mono leading-tight tabular-nums';
    if (layout.overflow) {
      // Keep numeric precision readable beside native scrollbars, even at narrow widths.
      const extra = geometry.dedicated ? 0 : Math.min(48, Math.max(0, geometry.axisX));
      region.style.left = `${geometry.axisX + 1 - extra}px`;
      region.style.width = `${Math.max(1, geometry.width + extra - 2)}px`;
      region.dataset.endpointOverflow = '';
      region.tabIndex = 0;
      region.className += ' overflow-y-auto overscroll-contain border';
      region.style.borderColor = theme.border;
      region.style.background = theme.background;
      region.style.top = `${geometry.top}px`;
      region.style.height = `${geometry.height}px`;
      region.style.scrollPaddingTop = `${geometry.fontSize * 1.3 + 12}px`;
      const heading = document.createElement('div');
      heading.className = 'sticky top-0 z-10 border-b px-1 py-1 text-center';
      heading.textContent = `List ↕ (${labels.length})`;
      heading.style.background = theme.background; heading.style.borderColor = theme.border;
      region.appendChild(heading);
    } else {region.style.top = '0'; region.style.height = '100%'; region.style.pointerEvents = 'none';}
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
    svg.classList.add('absolute', 'inset-0', 'pointer-events-none');
    this.root.appendChild(svg);
    const ordinals = new Map(labels.map((label, index) => [label.id, index + 1]));
    layout.labels.forEach(label => {
      const ordinal = ordinals.get(label.id)!;
      const box = document.createElement('div'), numeric = label.value != null;
      box.dataset.endpointLabel = label.id;
      box.dataset.endpointValue = label.value == null ? '' : String(label.value);
      box.dataset.endpointTime = label.time == null ? '' : String(label.time);
      box.dataset.endpointEdge = label.edge ?? '';
      box.dataset.endpointAnchorY = label.anchorY == null ? '' : String(label.anchorY);
      box.dataset.endpointAnchorX = label.anchorX == null ? '' : String(label.anchorX);
      box.dataset.endpointCenterY = String(label.y);
      box.setAttribute('role', 'note'); box.tabIndex = 0;
      const time = label.time == null ? 'No accepted bar in visible window' : typeof label.time === 'number' ? new Date(label.time * 1000).toISOString() : label.time;
      const scaleState = label.edge === 'above' ? 'Above visible scale' : label.edge === 'below' ? 'Below visible scale' : label.edge === 'undefined' ? `Undefined on current scale${label.scaleIssue ? ` (${label.scaleIssue})` : ''}` : '';
      const placement = layout.overflow ? `List row, not a price position${scaleState ? `. ${scaleState}` : ''}` : !numeric ? 'Missing sample; unpositioned' : label.edge === 'above' ? `${scaleState}; upper edge anchor` : label.edge === 'below' ? `${scaleState}; lower edge anchor` : label.edge === 'undefined' ? `${scaleState}; unpositioned` : label.displaced ? 'Displaced box; connector marks true endpoint' : 'At endpoint price';
      const description = `${ordinal}. ${label.label}. ${time}. ${numeric ? `Value ${label.value}` : 'No supplied sample / warmup; no numeric value'}. ${label.status}. ${placement}. Chart display value; complete source evidence remains in study details.`;
      box.setAttribute('aria-label', description); box.title = description;
      box.className = 'pointer-events-auto box-border flex flex-col justify-center border px-1 outline-offset-1 focus-visible:outline focus-visible:outline-2';
      box.style.borderColor = label.color; box.style.background = theme.background; box.style.color = theme.text;
      box.style.height = `${rowHeight - 2}px`;
      if (layout.overflow) box.className += ' relative my-0.5';
      else {box.className += ' absolute w-full'; box.style.top = `${label.y - (rowHeight - 2) / 2}px`;}
      const value = document.createElement('span'); value.dataset.endpointNumber = ''; value.className = geometry.dedicated ? 'block break-all' : 'block'; value.style.fontSize = `${geometry.dedicated ? Math.max(11, geometry.fontSize) : 10}px`; value.textContent = `${label.edge === 'above' ? '↑' : label.edge === 'below' ? '↓' : label.edge === 'undefined' ? '⚠' : label.displaced && !layout.overflow ? '↕' : ''}${movingAverageValueText(label.value)}`;
      if (!numeric) value.textContent = '— missing';
      box.appendChild(value); region.appendChild(box);
      if (numeric && label.anchorY != null && label.anchorX != null && !layout.overflow) {
        const anchorY = Math.max(geometry.top, Math.min(geometry.top + geometry.height, label.anchorY));
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('d', `M ${label.anchorX} ${anchorY} L ${geometry.axisX - 7} ${anchorY} L ${geometry.axisX} ${label.y}`);
        line.setAttribute('fill', 'none'); line.setAttribute('stroke', label.color); line.setAttribute('stroke-width', '1');
        if (label.edge) line.setAttribute('stroke-dasharray', '2 2');
        svg.appendChild(line);
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dot.setAttribute('cx', String(label.anchorX)); dot.setAttribute('cy', String(anchorY)); dot.setAttribute('r', '2'); dot.setAttribute('fill', label.color); svg.appendChild(dot);
      }
    });
    this.root.appendChild(region);
    if (layout.overflow) region.scrollTop = scrollTop;
    if (active) Array.from(region.querySelectorAll<HTMLElement>('[data-endpoint-label]')).find(node => node.dataset.endpointLabel === active)?.focus({preventScroll: true});
    else if (overflowFocused && layout.overflow) region.focus({preventScroll: true});
  }
}
