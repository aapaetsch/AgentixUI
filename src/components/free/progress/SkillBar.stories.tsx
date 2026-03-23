import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SkillBar } from "./index";

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof SkillBar> = {
  title: "Free/Components/Progress/SkillBar",
  component: SkillBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    skill: {
      control: "text",
    },
    level: {
      control: { type: "range", min: 0, max: 100 },
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkillBar>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <SkillBar skill="React" level={85} />
    </div>
  ),
};

export const WithLevel: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <SkillBar skill="React" level={85} showValue />
      <SkillBar skill="TypeScript" level={75} showValue />
      <SkillBar skill="CSS" level={90} showValue />
    </div>
  ),
};

// ============================================================================
// Variants
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <SkillBar skill="React" level={85} variant="default" showValue />
      <SkillBar skill="TypeScript" level={75} variant="success" showValue />
      <SkillBar skill="CSS" level={90} variant="info" showValue />
      <SkillBar skill="Node.js" level={65} variant="warning" showValue />
      <SkillBar skill="Testing" level={45} variant="error" showValue />
    </div>
  ),
};

// ============================================================================
// Sizes
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <SkillBar skill="React" level={85} size="xs" showValue />
      <SkillBar skill="TypeScript" level={75} size="sm" showValue />
      <SkillBar skill="CSS" level={90} size="md" showValue />
      <SkillBar skill="Node.js" level={65} size="lg" showValue />
    </div>
  ),
};

// ============================================================================
// With Gradient
// ============================================================================

export const WithGradient: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <SkillBar
        skill="React"
        level={85}
        showValue
        gradient={{
          stops: [
            { offset: "0%", color: "#3b82f6" },
            { offset: "100%", color: "#8b5cf6" },
          ],
        }}
      />
      <SkillBar
        skill="TypeScript"
        level={75}
        showValue
        gradient={{
          stops: [
            { offset: "0%", color: "#22c55e" },
            { offset: "100%", color: "#15803d" },
          ],
        }}
      />
      <SkillBar
        skill="CSS"
        level={90}
        showValue
        gradient={{
          stops: [
            { offset: "0%", color: "#ef4444" },
            { offset: "50%", color: "#f59e0b" },
            { offset: "100%", color: "#22c55e" },
          ],
        }}
      />
    </div>
  ),
};

// ============================================================================
// Complete Skill Set
// ============================================================================

export const CompleteSkillSet: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
      <SkillBar skill="React" level={90} variant="info" showValue />
      <SkillBar skill="TypeScript" level={85} variant="info" showValue />
      <SkillBar skill="Node.js" level={80} variant="success" showValue />
      <SkillBar skill="CSS/Tailwind" level={85} variant="success" showValue />
      <SkillBar skill="GraphQL" level={70} variant="default" showValue />
      <SkillBar skill="Testing" level={75} variant="default" showValue />
      <SkillBar skill="Docker" level={60} variant="warning" showValue />
    </div>
  ),
};
