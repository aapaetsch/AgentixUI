import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DrawingInlineTextEditor } from ".";

describe("DrawingInlineTextEditor", () => {
  it("keeps text controlled and exposes plain-text commit and cancellation intents", () => {
    const onValueChange = vi.fn(); const onCommit = vi.fn(); const onCancel = vi.fn();
    render(<DrawingInlineTextEditor value="Plain text" onValueChange={onValueChange} onCommit={onCommit} onCancel={onCancel} />);
    const editor = screen.getByRole("textbox", { name: "Drawing text" }); fireEvent.change(editor, { target: { value: "Updated" } }); expect(onValueChange).toHaveBeenCalledWith("Updated"); fireEvent.keyDown(editor, { key: "Enter", ctrlKey: true }); expect(onCommit).toHaveBeenCalled(); fireEvent.keyDown(editor, { key: "Escape" }); expect(onCancel).toHaveBeenCalled();
  });
});
