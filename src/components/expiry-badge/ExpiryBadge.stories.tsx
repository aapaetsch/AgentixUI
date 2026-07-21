import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ExpiryBadge } from "./index";

const meta: Meta<typeof ExpiryBadge> = {
  title: "Components/ExpiryBadge",
  component: ExpiryBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    thresholds: { control: { type: "object" } },
    band: {
      options: ["far", "near", "imminent", "expiring"],
      control: { type: "select" },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ExpiryBadge>;

const now = Date.now();
const day = 86_400_000;

export const Far: Story = {
  args: { expiry: now + 60 * day, daysToExpiry: 60, showDate: true },
};

export const Near: Story = {
  args: { expiry: now + 14 * day, daysToExpiry: 14, showDate: true },
};

export const Imminent: Story = {
  args: { expiry: now + 3 * day, daysToExpiry: 3, showDate: true },
};

export const Expiring: Story = {
  args: { expiry: now + 0.4 * day, daysToExpiry: 0.4, showDate: true },
};

export const CustomThresholds: Story = {
  args: {
    expiry: now + 10 * day,
    daysToExpiry: 10,
    thresholds: [60, 14, 2],
    showDate: true,
  },
};

export const DateOnly: Story = {
  args: { expiry: now + 14 * day, daysToExpiry: 14, showDays: false },
};

/* ---------------------------------------------------------------------------------------------- *
 * Edge cases — boundary DTE values + rendering flags
 * ---------------------------------------------------------------------------------------------- */

export const BoundaryFarToNearAt30: Story = {
  name: "Boundary: dte=30 → near",
  args: { expiry: now + 30 * day, daysToExpiry: 30, showDate: true },
};

export const BoundaryNearToImminentAt7: Story = {
  name: "Boundary: dte=7 → imminent",
  args: { expiry: now + 7 * day, daysToExpiry: 7, showDate: true },
};

export const BoundaryImminentToExpiringAt1: Story = {
  name: "Boundary: dte=1 → expiring",
  args: { expiry: now + 1 * day, daysToExpiry: 1, showDate: true },
};

export const JustAboveFarAt30_5: Story = {
  name: "dte=30.5 → far",
  args: { expiry: now + 30.5 * day, daysToExpiry: 30.5, showDate: true },
};

export const SubDayHoursAt0_99: Story = {
  name: "dte=0.99 → 24h (expiring)",
  args: { expiry: now + 0.99 * day, daysToExpiry: 0.99, showDate: true },
};

export const ExpiredAt0: Story = {
  name: "dte=0 → 0d (expiring)",
  args: { expiry: now, daysToExpiry: 0, showDate: true },
};

export const DateOnlyShowDateHideDays: Story = {
  name: "showDate=true showDays=false (date only)",
  args: { expiry: now + 14 * day, daysToExpiry: 14, showDate: true, showDays: false },
};

export const BothHiddenFallsBackToDays: Story = {
  name: "showDate=false showDays=false → days fallback",
  args: { expiry: now + 14 * day, daysToExpiry: 14, showDate: false, showDays: false },
};

export const PulseDisabled: Story = {
  name: "expiring with pulseOnExpiring=false",
  args: {
    expiry: now + 0.4 * day,
    daysToExpiry: 0.4,
    showDate: true,
    pulseOnExpiring: false,
  },
};