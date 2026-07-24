/**
 * Pure finance helpers used by options components and their stories.
 *
 * Everything here is dependency-free, SSR-safe, and side-effect free. UI
 * components never price options themselves; these helpers implement only the
 * trivial arithmetic needed to *display* payoff shapes and breakevens given
 * already-priced legs.
 *
 * @module finance-utils
 */

import type { OptionLeg, PayoffPoint } from "./finance-types";

/**
 * Intrinsic payoff of a single option leg at expiry, for a given underlying
 * price. Long legs contribute `+intrinsic × contracts`; short legs contribute
 * `-intrinsic × contracts`. Each contract represents 100 shares.
 */
function legPayoffAtPrice(leg: OptionLeg, price: number): number {
  const sign = leg.side === "buy" ? 1 : -1;
  const intrinsic =
    leg.type === "call"
      ? Math.max(0, price - leg.strike)
      : Math.max(0, leg.strike - price);
  return sign * intrinsic * leg.contracts * 100;
}

/**
 * Total premium paid (positive) or received (negative) for a set of legs,
 * assuming `leg.limitPrice` is the per-share price. Returns `0` when no leg
 * carries a `limitPrice`.
 */
export function netPremium(legs: OptionLeg[]): number {
  return legs.reduce((sum, leg) => {
    if (leg.limitPrice == null) return sum;
    const sign = leg.side === "buy" ? -1 : 1;
    return sum + sign * leg.limitPrice * leg.contracts * 100;
  }, 0);
}

/**
 * Compute the at-expiry payoff curve for a multi-leg position over a list of
 * underlying prices. The returned `value` for each price is
 * `Σ legPayoff + netPremium`. Prices are returned in the same order as input.
 *
 * Pass a dense-enough price grid (e.g. linspace around the strikes) for a
 * smooth curve. The helper is agnostic to grid spacing.
 */
export function computePayoffAtExpiry(
  legs: OptionLeg[],
  prices: number[]
): PayoffPoint[] {
  const premium = netPremium(legs);
  return prices.map((price) => ({
    price,
    value: legs.reduce((acc, leg) => acc + legPayoffAtPrice(leg, price), 0) + premium,
  }));
}

/**
 * Breakeven underlying prices at expiry: roots of the piecewise-linear payoff
 * function on the supplied price grid. Returns at most one breakeven per
 * adjacent strike interval — sufficient for v1 display. Returns `[]` when no
 * sign change is found on the grid.
 */
export function breakevensAtExpiry(
  legs: OptionLeg[],
  prices: number[]
): number[] {
  const points = computePayoffAtExpiry(legs, prices);
  const out: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (a.value === 0) {
      out.push(a.price);
    } else if (a.value * b.value < 0) {
      // Linear interpolation for the zero-crossing.
      const t = -a.value / (b.value - a.value);
      out.push(a.price + t * (b.price - a.price));
    }
  }
  // Deduplicate (a price exactly 0 at a node + an interpolated crossing).
  const seen = new Set<number>();
  return out.filter((p) => {
    const key = Math.round(p * 1e6);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Maximum profit achievable at expiry over the supplied price grid. Returns
 * `null` only when `prices` is empty. Note: a value of `Infinity` is *not*
 * returned here — the caller picks the grid extent; for unbounded profiles use
 * a wide enough grid to represent the asymptote.
 */
export function maxProfitAtExpiry(
  legs: OptionLeg[],
  prices: number[]
): number | null {
  if (prices.length === 0) return null;
  const points = computePayoffAtExpiry(legs, prices);
  return points.reduce((max, p) => (p.value > max ? p.value : max), -Infinity);
}

/**
 * Maximum loss achievable at expiry over the supplied price grid. Same
 * semantics as {@link maxProfitAtExpiry}: bounded by the grid extent.
 */
export function maxLossAtExpiry(
  legs: OptionLeg[],
  prices: number[]
): number | null {
  if (prices.length === 0) return null;
  const points = computePayoffAtExpiry(legs, prices);
  return points.reduce((min, p) => (p.value < min ? p.value : min), Infinity);
}

/**
 * Build a linearly-spaced price grid around a center, useful for payoff
 * diagrams. Always includes every leg strike so the kink points are sampled.
 */
export function priceGrid(
  legs: OptionLeg[],
  center: number,
  widthPercent = 0.2,
  steps = 81
): number[] {
  const strikes = legs.map((l) => l.strike);
  const lo = Math.min(...strikes, center) * (1 - widthPercent);
  const hi = Math.max(...strikes, center) * (1 + widthPercent);
  const out = new Set<number>();
  for (let i = 0; i < steps; i++) {
    out.add(lo + ((hi - lo) * i) / (steps - 1));
  }
  for (const k of strikes) out.add(k);
  out.add(center);
  return Array.from(out).sort((a, b) => a - b);
}