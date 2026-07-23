import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Input } from "./index";

describe("Input", () => {
  it("renders a text input with a placeholder", () => {
    render(<Input placeholder="Enter your email" />);
    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeDefined();
    expect(input.getAttribute("type")).toBe("text");
  });

  it("forwards the ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref target" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.getAttribute("placeholder")).toBe("Ref target");
  });

  it("applies the destructive border class and aria-invalid when error is set", () => {
    render(<Input error placeholder="Bad value" />);
    const input = screen.getByPlaceholderText("Bad value");
    // The error compound variant adds the destructive border utility.
    expect(input.className).toContain("border-destructive");
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("does not set aria-invalid when error is not set", () => {
    render(<Input placeholder="Good value" />);
    const input = screen.getByPlaceholderText("Good value");
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  it("supports the type attribute (password)", () => {
    render(<Input type="password" placeholder="Secret" />);
    const input = screen.getByPlaceholderText("Secret");
    expect(input.getAttribute("type")).toBe("password");
  });

  it("renders a label when the label prop is provided", () => {
    render(<Input label="Email" placeholder="example@test.com" />);
    expect(screen.getByText("Email")).toBeDefined();
    expect(screen.getByPlaceholderText("example@test.com")).toBeDefined();
  });
});