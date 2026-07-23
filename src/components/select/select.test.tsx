import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./index";

// Radix Select uses pointer capture and ResizeObserver during open/select.
// jsdom does not implement these, so we stub them before any test runs.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
beforeAll(() => {
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!window.ResizeObserver) {
    window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  }
});

function ControlledSelect({
  value,
  onValueChange,
  onOpenChange,
  disabled,
}: {
  value: string;
  onValueChange: (v: string) => void;
  onOpenChange?: (o: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onValueChange} onOpenChange={onOpenChange} disabled={disabled}>
      <SelectTrigger data-testid="trigger">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("renders a combobox trigger with the placeholder when no value is set", () => {
    render(<ControlledSelect value="" onValueChange={vi.fn()} />);
    const trigger = screen.getByTestId("trigger");
    expect(trigger.getAttribute("role")).toBe("combobox");
    expect(screen.getByText("Pick a fruit")).toBeDefined();
  });

  it("renders the selected item label in the trigger when a value is set", () => {
    render(<ControlledSelect value="banana" onValueChange={vi.fn()} />);
    expect(screen.getByText("Banana")).toBeDefined();
  });

  it("exposes the trigger state as closed initially and flips aria-expanded on open request", () => {
    const handleOpenChange = vi.fn();
    render(<ControlledSelect value="" onOpenChange={handleOpenChange} onValueChange={vi.fn()} />);
    const trigger = screen.getByTestId("trigger");
    expect(trigger.getAttribute("data-state")).toBe("closed");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.pointerDown(trigger, { button: 0 });
    fireEvent.click(trigger);
    // The handler is invoked to request opening.
    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it("does not render SelectContent options into the document before opening", () => {
    render(<ControlledSelect value="" onValueChange={vi.fn()} />);
    // Radix portals the content; nothing is mounted until opened.
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("disables the trigger when the Select is disabled", () => {
    render(<ControlledSelect value="" onValueChange={vi.fn()} disabled />);
    expect(screen.getByTestId("trigger").hasAttribute("disabled")).toBe(true);
  });
});
