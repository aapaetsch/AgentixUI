import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarActions,
  Navrail,
  NavrailContent,
} from "./index";
import { PremiumNavItem } from "./items";

describe("Navbar", () => {
  it("renders with role=navigation and an accessible label", () => {
    render(
      <Navbar>
        <NavbarBrand>BrandX</NavbarBrand>
      </Navbar>,
    );
    const nav = screen.getByRole("navigation");
    expect(nav.getAttribute("aria-label")).toBe("Main navigation");
  });

  it("renders brand and child content", () => {
    render(
      <Navbar>
        <NavbarBrand>BrandX</NavbarBrand>
        <NavbarContent>Content text</NavbarContent>
      </Navbar>,
    );
    expect(screen.getByText("BrandX")).toBeDefined();
    expect(screen.getByText("Content text")).toBeDefined();
  });

  it("renders NavbarActions content", () => {
    render(
      <Navbar>
        <NavbarActions>
          <button type="button">Action</button>
        </NavbarActions>
      </Navbar>,
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeDefined();
  });
});

describe("Navrail", () => {
  it("renders with role=navigation", () => {
    render(
      <Navrail>
        <NavrailContent>
          <PremiumNavItem id="home" label="Home" />
        </NavrailContent>
      </Navrail>,
    );
    // Both the navbar-less aside and the item are present; aside has the role.
    const navRegions = screen.getAllByRole("navigation");
    expect(navRegions.length).toBeGreaterThanOrEqual(1);
  });

  it("renders nav items inside NavrailContent", () => {
    render(
      <Navrail>
        <NavrailContent>
          <PremiumNavItem id="home" label="Home" />
          <PremiumNavItem id="settings" label="Settings" />
        </NavrailContent>
      </Navrail>,
    );
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Settings")).toBeDefined();
  });

  it("calls onClick when a nav item is clicked", () => {
    const handleClick = vi.fn();
    render(
      <Navrail>
        <NavrailContent>
          <PremiumNavItem id="home" label="Home" onClick={handleClick} />
        </NavrailContent>
      </Navrail>,
    );
    fireEvent.click(screen.getByText("Home"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});