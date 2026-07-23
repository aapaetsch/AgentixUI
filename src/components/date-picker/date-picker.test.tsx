import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { DatePicker } from "./index";
import { formatDate, DATE_FORMATS } from "../../lib/date-utils";

// react-day-picker reads layout (getBoundingClientRect) for some features;
// jsdom returns zeros which is fine for controlled rendering. matchMedia is
// used by dependent animated-number utilities in the wider tree, so stub it.
beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia;
  }
});

describe("DatePicker", () => {
  const selectedDate = new Date(2024, 5, 15); // Jun 15, 2024

  it("renders a button trigger with the placeholder when no date is selected", () => {
    render(<DatePicker placeholder="Pick a date" />);
    expect(screen.getByText("Pick a date")).toBeDefined();
  });

  it("displays the formatted selected date in the trigger when a value is set", () => {
    render(<DatePicker selected={selectedDate} />);
    expect(screen.getByText(formatDate(selectedDate, DATE_FORMATS.date))).toBeDefined();
  });

  it("opens the calendar popup when the trigger is clicked", async () => {
    render(<DatePicker selected={selectedDate} defaultMonth={selectedDate} />);

    // Trigger shows the selected date before opening.
    expect(screen.getByText(formatDate(selectedDate, DATE_FORMATS.date))).toBeDefined();

    // The calendar popover is not present initially (no grid).
    expect(screen.queryByRole("grid")).toBeNull();

    // The trigger is the button labelled with the default placeholder.
    fireEvent.click(screen.getByRole("button", { name: /Select date/i }));

    // After opening, react-day-picker renders a grid.
    const grid = await screen.findByRole("grid");
    expect(grid).toBeDefined();
  });

  it("respects the controlled open state (open=true shows the calendar grid)", () => {
    render(<DatePicker selected={selectedDate} defaultMonth={selectedDate} open onOpenChange={vi.fn()} />);
    expect(screen.getByRole("grid")).toBeDefined();
  });
});