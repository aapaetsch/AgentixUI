import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./index";

describe("Dialog (controlled)", () => {
  function ControlledDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  it("renders content when open=true", () => {
    render(<ControlledDialog open onOpenChange={vi.fn()} />);
    expect(screen.getByText("Confirm action")).toBeDefined();
    expect(screen.getByText("Are you sure?")).toBeDefined();
  });

  it("does not render content when open=false", () => {
    render(<ControlledDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText("Confirm action")).toBeNull();
  });

  it("renders a role=dialog with an accessible name from the DialogTitle", () => {
    render(<ControlledDialog open onOpenChange={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-labelledby") || dialog.getAttribute("aria-describedby") || dialog.textContent).toBeTruthy();
    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBeTruthy();
  });

  it("calls onOpenChange(false) when the close button is clicked", () => {
    const handleOpenChange = vi.fn();
    render(<ControlledDialog open onOpenChange={handleOpenChange} />);
    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders the DialogTrigger when uncontrolled and opens on click", () => {
    function Uncontrolled() {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <button type="button">Open dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uncontrolled title</DialogTitle>
              <DialogDescription>Body</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    }
    render(<Uncontrolled />);
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByText("Open dialog"));
    expect(screen.getByRole("dialog")).toBeDefined();
  });
});