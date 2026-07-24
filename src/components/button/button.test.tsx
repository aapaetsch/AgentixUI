import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./index";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeDefined();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button", { name: /click/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as a child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/x">Link</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: /link/i });
    expect(link).toBeDefined();
  });

  it("applies the filled colorStyle variant class", () => {
    render(<Button colorStyle="filled">F</Button>);
    const btn = screen.getByRole("button", { name: /^f$/i });
    // CVA fills the bg-primary utility for the filled variant.
    expect(btn.className).toContain("bg-primary");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button", { name: /nope/i }).hasAttribute("disabled")).toBe(true);
  });
});