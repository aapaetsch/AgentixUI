import { describe, expect, it } from "vitest";

import { createDrawingHistory, initialDrawingHistory, reduceDrawingHistory } from ".";

const drawing = {
  id: "d1", type: "horizontal-line", version: 1, points: [{ time: 1, price: 100 }],
  parameters: {}, visible: true, locked: false,
};

describe("drawing command history", () => {
  it("supports controlled add, lock, undo, and redo", () => {
    const added = reduceDrawingHistory(initialDrawingHistory, { type: "add", drawing });
    const locked = reduceDrawingHistory(added, { type: "toggleLock", id: "d1" });
    expect(locked.present[0].locked).toBe(true);
    const undone = reduceDrawingHistory(locked, { type: "undo" });
    expect(undone.present[0].locked).toBe(false);
    expect(reduceDrawingHistory(undone, { type: "redo" }).present[0].locked).toBe(true);
  });

  it("bounds history at the configured limit", () => {
    let history = createDrawingHistory([], 2);
    for (let index = 0; index < 4; index += 1) {
      history = reduceDrawingHistory(history, { type: "commit", drawings: [{ ...drawing, id: `d${index}` }], metadata: { type: "create", drawingIds: [`d${index}`] } });
    }
    expect(history.past).toHaveLength(2);
    expect(reduceDrawingHistory(reduceDrawingHistory(reduceDrawingHistory(history, { type: "undo" }), { type: "undo" }), { type: "undo" }).present[0].id).toBe("d1");
  });

  it("coalesces a transaction into one undo entry", () => {
    const base = createDrawingHistory([drawing]);
    const first = reduceDrawingHistory(base, { type: "commit", drawings: [{ ...drawing, points: [{ time: 1, price: 101 }] }], metadata: { type: "move", drawingIds: ["d1"], transactionId: "drag-1" } });
    const second = reduceDrawingHistory(first, { type: "commit", drawings: [{ ...drawing, points: [{ time: 1, price: 102 }] }], metadata: { type: "move", drawingIds: ["d1"], transactionId: "drag-1" } });
    expect(second.past).toHaveLength(1);
    expect(reduceDrawingHistory(second, { type: "undo" }).present[0].points[0].price).toBe(100);
  });

  it("rebases external state and invalidates redo", () => {
    const committed = reduceDrawingHistory(createDrawingHistory([drawing]), { type: "commit", drawings: [{ ...drawing, locked: true }], metadata: { type: "lock", drawingIds: ["d1"] } });
    const undone = reduceDrawingHistory(committed, { type: "undo" });
    expect(undone.future).toHaveLength(1);
    const external = reduceDrawingHistory(undone, { type: "rebase", drawings: [{ ...drawing, visible: false }] });
    expect(external.past).toHaveLength(0);
    expect(external.future).toHaveLength(0);
    expect(external.present[0].visible).toBe(false);
  });

  it("does not add transient selection to undo history", () => {
    const selected = reduceDrawingHistory(createDrawingHistory([drawing]), { type: "select", id: "d1" });
    expect(selected.present[0].selected).toBe(true);
    expect(selected.past).toHaveLength(0);
  });
});
