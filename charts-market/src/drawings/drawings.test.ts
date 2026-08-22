import { describe, expect, it } from "vitest";

import { initialDrawingHistory, reduceDrawingHistory } from ".";

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
});
