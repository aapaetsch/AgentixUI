import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  LinearProgress,
  CircularProgress,
  ProgressGroup,
  SkillBar,
  useAnimatedProgress,
} from "./index";

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof ProgressGroup> = {
  title: "Components/Progress/ProgressGroup",
  component: ProgressGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    gap: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressGroup>;

// ============================================================================
// Basic Examples
// ============================================================================

export const VerticalGroup: Story = {
  render: () => (
    <ProgressGroup direction="vertical" gap="md">
      <LinearProgress value={75} label="Task 1" showValue />
      <LinearProgress value={50} label="Task 2" showValue variant="success" />
      <LinearProgress value={25} label="Task 3" showValue variant="warning" />
    </ProgressGroup>
  ),
};

export const HorizontalGroup: Story = {
  render: () => (
    <ProgressGroup direction="horizontal" gap="md">
      <CircularProgress value={75} showValue size="lg" />
      <CircularProgress value={50} showValue size="lg" variant="success" />
      <CircularProgress value={25} showValue size="lg" variant="warning" />
    </ProgressGroup>
  ),
};

export const MixedGroup: Story = {
  render: () => (
    <div className="w-96">
      <ProgressGroup direction="vertical" gap="lg">
        <div>
          <h4 className="text-sm font-medium mb-2">Linear Progress</h4>
          <LinearProgress value={75} showValue />
        </div>
        <div className="flex justify-center">
          <CircularProgress value={75} showValue size="xl" label="Circular" />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Skills</h4>
          <ProgressGroup direction="vertical" gap="sm">
            <SkillBar skill="React" level={85} showValue />
            <SkillBar skill="TypeScript" level={75} showValue />
          </ProgressGroup>
        </div>
      </ProgressGroup>
    </div>
  ),
};

// ============================================================================
// Dashboard Example
// ============================================================================

const DashboardDemo = () => {
  const { value: cpuValue } = useAnimatedProgress({
    from: 20,
    to: 80,
    duration: 3000,
    loop: true,
    easing: "easeInOutQuad",
  });

  const { value: memValue } = useAnimatedProgress({
    from: 30,
    to: 70,
    duration: 2500,
    loop: true,
    easing: "easeInOutQuad",
  });

  const { value: diskValue } = useAnimatedProgress({
    from: 10,
    to: 90,
    duration: 4000,
    loop: true,
    easing: "easeInOutQuad",
  });

  return (
    <div className="w-[400px] p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-4">System Resources</h3>
      <ProgressGroup direction="vertical" gap="lg">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">CPU Usage</span>
            <span className="text-sm text-muted-foreground">{Math.round(cpuValue)}%</span>
          </div>
          <LinearProgress
            value={cpuValue}
            variant={cpuValue > 70 ? "error" : cpuValue > 50 ? "warning" : "success"}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Memory</span>
            <span className="text-sm text-muted-foreground">{Math.round(memValue)}%</span>
          </div>
          <LinearProgress
            value={memValue}
            variant={memValue > 70 ? "error" : memValue > 50 ? "warning" : "info"}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Disk Space</span>
            <span className="text-sm text-muted-foreground">{Math.round(diskValue)}%</span>
          </div>
          <LinearProgress
            value={diskValue}
            variant={diskValue > 70 ? "error" : diskValue > 50 ? "warning" : "default"}
          />
        </div>
      </ProgressGroup>
    </div>
  );
};

export const DashboardExample: Story = {
  render: () => <DashboardDemo />,
};

// ============================================================================
// Game Stats Example
// ============================================================================

const GameStatsDemo = () => {
  return (
    <div className="w-[500px] p-6 rounded-lg border bg-card">
      <h3 className="text-xl font-bold mb-6">Player Stats</h3>
      <ProgressGroup direction="horizontal" gap="lg">
        <div className="flex flex-col items-center gap-2">
          <CircularProgress
            value={85}
            showValue
            size="2xl"
            variant="error"
            arcType="three-quarter"
          >
            <div className="text-center">
              <div className="text-xl font-bold">85</div>
              <div className="text-xs text-muted-foreground">HP</div>
            </div>
          </CircularProgress>
          <span className="text-sm font-medium">Health</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <CircularProgress
            value={60}
            showValue
            size="2xl"
            variant="info"
            arcType="three-quarter"
          >
            <div className="text-center">
              <div className="text-xl font-bold">60</div>
              <div className="text-xs text-muted-foreground">MP</div>
            </div>
          </CircularProgress>
          <span className="text-sm font-medium">Mana</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <CircularProgress
            value={45}
            showValue
            size="2xl"
            variant="warning"
            arcType="three-quarter"
          >
            <div className="text-center">
              <div className="text-xl font-bold">45</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
          </CircularProgress>
          <span className="text-sm font-medium">Experience</span>
        </div>
      </ProgressGroup>
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-3">Abilities</h4>
        <ProgressGroup direction="vertical" gap="sm">
          <SkillBar skill="Strength" level={90} variant="error" showValue />
          <SkillBar skill="Intelligence" level={75} variant="info" showValue />
          <SkillBar skill="Agility" level={85} variant="success" showValue />
          <SkillBar skill="Luck" level={40} variant="warning" showValue />
        </ProgressGroup>
      </div>
    </div>
  );
};

export const GameStatsExample: Story = {
  render: () => <GameStatsDemo />,
};

// ============================================================================
// Multi-Step Process Example
// ============================================================================

const MultiStepDemo = () => {
  const steps = [
    { label: "Account Setup", value: 100, variant: "success" as const },
    { label: "Profile Information", value: 100, variant: "success" as const },
    { label: "Preferences", value: 60, variant: "default" as const },
    { label: "Confirmation", value: 0, variant: "default" as const },
  ];

  return (
    <div className="w-[400px] p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-4">Registration Progress</h3>
      <ProgressGroup direction="vertical" gap="md">
        {steps.map((step, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{step.label}</span>
              <span className="text-sm text-muted-foreground">
                {step.value === 100 ? "✓" : `${step.value}%`}
              </span>
            </div>
            <LinearProgress value={step.value} variant={step.variant} />
          </div>
        ))}
      </ProgressGroup>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Overall Progress</span>
          <span className="text-sm font-semibold">65%</span>
        </div>
        <LinearProgress value={65} variant="info" size="lg" />
      </div>
    </div>
  );
};

export const MultiStepProcess: Story = {
  render: () => <MultiStepDemo />,
};
