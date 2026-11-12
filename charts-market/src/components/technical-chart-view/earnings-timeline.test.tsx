import * as React from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TechnicalChartView } from ".";
import type { MarketChartHandle } from "../market-chart";
import { createTechnicalChartViewState, marketTimeKey, type MarketTime, type OhlcBar } from "../../core";
import type { TechnicalEarningsEvent } from "./earnings";

const times = ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09"] as const;
const bars: readonly OhlcBar[] = times.slice(0, 3).map(time => ({time, open:100, high:102, low:99, close:101}));
const events: readonly TechnicalEarningsEvent[] = [
  {id:"first", time:times[0], barTime:times[0], label:"First report"},
  {id:"middle", time:times[2], barTime:times[2], label:"Middle report"},
  {id:"last", time:times[4], barTime:times[4], label:"Upcoming report", estimated:true, session:"after-close"},
  {id:"unanchored", time:"2026-10-12", label:"Unanchored future"},
];
let width = 430;
let resizeObservers: ResizeObserverCallback[];
beforeEach(() => {
  width = 430;
  resizeObservers = [];
  vi.stubGlobal("ResizeObserver", class {
    constructor(private callback: ResizeObserverCallback) {resizeObservers.push(callback);}
    observe(target: Element) {
      this.callback([{target, contentRect:{width,height:300}} as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(new Proxy({measureText:(s:string)=>({width:s.length*6})}, {get:(o,k)=>k in o?o[k as keyof typeof o]:vi.fn()}) as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => width);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function state() {
  const value = createTechnicalChartViewState("price-only");
  value.panes = value.panes.slice(0,1).map(p => ({...p, showVolume:false, studyIds:[]}));
  value.indicators = []; value.profiles = []; value.drawings = [];
  value.viewport = {visibleRange:{from:times[0], to:times[4]}};
  return value;
}

function fixture(api: React.RefObject<MarketChartHandle | null>, earnings = events, calendar: readonly MarketTime[] = times) {
  return <TechnicalChartView chartApiRef={api} symbol="SYNTHETIC" interval="1D" data={bars}
    earnings={earnings} timeAxis={{mode:"calendar", times:calendar}} state={state()} onStateChange={() => {}}
    calculationMode="supplied" calculationIdentity="synthetic-earnings" dataIdentity="synthetic-earnings"
    features={{header:false, commands:false, drawingRail:false, footer:false}}
    appearance={{height:300, legends:"compact"}} />;
}

describe("native earnings timeline", () => {
  it("renders fitted first, middle and future calendar-edge pins, with unchanged economic anchors", async () => {
    const source = JSON.stringify(bars), api = React.createRef<MarketChartHandle>();
    render(fixture(api));
    const upcoming = await screen.findByRole("button", {name:/Upcoming report/});
    const first = screen.getByRole("button", {name:/First report/});
    expect(screen.getByRole("button", {name:/Middle report/})).toHaveTextContent("E");
    expect(screen.queryByRole("button", {name:/Unanchored future/})).not.toBeInTheDocument();
    const pane = api.current!.getSnapshot()!.panes[0];
    const left = pane.left ?? 0, right = left + pane.width;
    expect(api.current!.coordinateForTime(times[0])).toBe(left);
    expect(api.current!.coordinateForTime(times[4])).toBe(right);
    expect(api.current!.coordinateForTime(times[4])).not.toBe(api.current!.coordinateForTime(bars.at(-1)!.time));
    for (const pin of [first, upcoming]) {
      expect(parseFloat(pin.style.left)).toBeGreaterThanOrEqual(left + 2);
      expect(parseFloat(pin.style.left) + 24).toBeLessThanOrEqual(right - 2);
    }
    expect(upcoming).toHaveAccessibleName(/2026-10-09 · Estimated date · after close/);
    fireEvent.click(upcoming);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("Upcoming report · 2026-10-09");
    expect(dialog).toHaveTextContent("Reported EPS:");
    fireEvent.keyDown(dialog, {key:"Escape"});
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(upcoming).toHaveFocus());
    expect(JSON.stringify(bars)).toBe(source);
  });

  it("hides truly off-screen events and restores edge pins after pan, zoom, Fit and Latest", async () => {
    const api = React.createRef<MarketChartHandle>(); render(fixture(api));
    await screen.findByRole("button", {name:/Upcoming report/});
    act(() => api.current!.setVisibleRange({from:times[1], to:times[3]}));
    await waitFor(() => expect(screen.queryByRole("button", {name:/Upcoming report/})).not.toBeInTheDocument());
    expect(screen.queryByRole("button", {name:/First report/})).not.toBeInTheDocument();
    expect(screen.getByRole("button", {name:/Middle report/})).toBeInTheDocument();
    act(() => api.current!.setVisibleRange({from:times[2], to:times[4]}));
    await screen.findByRole("button", {name:/Upcoming report/});
    expect(screen.getByRole("button", {name:/Middle report/})).toBeInTheDocument();
    act(() => api.current!.fitContent());
    await screen.findByRole("button", {name:/First report/});
    act(() => api.current!.scrollToRealtime());
    await screen.findByRole("button", {name:/Upcoming report/});
  });

  it("updates supplied calendar/events and resized geometry without price rows or saved-state additions", async () => {
    const api = React.createRef<MarketChartHandle>(), view = render(fixture(api));
    await screen.findByRole("button", {name:/Upcoming report/});
    const next: readonly MarketTime[] = [...times, "2026-10-12"];
    const revised: readonly TechnicalEarningsEvent[] = [{id:"revised", time:"2026-10-12", barTime:"2026-10-12", label:"Revised upcoming"}];
    view.rerender(fixture(api, revised, next));
    act(() => api.current!.fitContent());
    const pin = await screen.findByRole("button", {name:/Revised upcoming/});
    expect(screen.queryByRole("button", {name:/Upcoming report/})).not.toBeInTheDocument();
    expect(api.current!.coordinateForTime("2026-10-12")).toBeGreaterThan(api.current!.coordinateForTime(bars.at(-1)!.time)!);
    width = 320;
    act(() => resizeObservers.forEach(callback => callback([{contentRect:{width}} as ResizeObserverEntry], {} as ResizeObserver)));
    await waitFor(() => {
      const pane = api.current!.getSnapshot()!.panes[0];
      expect(pane.width).toBeLessThan(350);
      expect(parseFloat(pin.style.left) + 24).toBeLessThanOrEqual((pane.left ?? 0) + pane.width - 2);
    });
    expect(bars).toHaveLength(3);
    expect(marketTimeKey(revised[0].barTime!)).toBe(marketTimeKey("2026-10-12"));
    view.rerender(fixture(api, [], next));
    expect(screen.queryByRole("button", {name:/report/i})).not.toBeInTheDocument();
    expect(screen.queryByText(/^Earnings \(/)).not.toBeInTheDocument();
  });
});
