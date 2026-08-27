import type { DrawingToolDefinition } from "../core";

export function normalizeDrawingToolDefinition(tool: DrawingToolDefinition): Required<Pick<DrawingToolDefinition, "rendererId" | "category" | "input">> & DrawingToolDefinition {
  const points = tool.input?.points ?? tool.requiredPoints ?? 1;
  return {
    ...tool,
    rendererId: tool.rendererId ?? tool.id,
    category: tool.category ?? "lines",
    input: tool.input ?? { mode: points === 1 ? "point" : "drag", points },
  };
}
