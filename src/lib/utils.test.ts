import { describe, it, expect } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("merges plain class names into one string", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("tailwind-merge wins for conflicting utilities", () => {
    // px-2 then px-4 => px-4 should win and px-2 should be dropped.
    expect(cn("px-2", "px-4")).toBe("px-4");
    // p-2 then px-4 => px-4 overrides the horizontal part.
    expect(cn("p-2", "px-4")).toMatch(/\bpx-4\b/);
  });

  it("filters out falsy/conditional values via clsx", () => {
    expect(cn("base", false, null, undefined, "tail")).toBe("base tail");
  });

  it("keeps non-conflicting classes from both inputs", () => {
    expect(cn("text-sm font-bold", "text-red-500")).toBe(
      "text-sm font-bold text-red-500",
    );
  });
});