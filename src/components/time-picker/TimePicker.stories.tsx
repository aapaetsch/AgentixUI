import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TimePicker, InlineTimePicker } from "./index";

const meta: Meta<typeof TimePicker> = {
  title: "Inputs/TimePicker",
  component: TimePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A time selection component with scrollable hour and minute columns. Supports 12-hour and 24-hour formats.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    timeFormat: {
      control: "select",
      options: ["12", "24"],
      description: "Time format (12 or 24 hour)",
    },
    minuteStep: {
      control: "number",
      description: "Step for minutes (e.g., 15 for quarter hours)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    required: {
      control: "boolean",
      description: "Required field",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default time picker (12-hour format)
 */
export const Default: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          placeholder="Select time"
        />
      </div>
    );
  },
};

/**
 * With label
 */
export const WithLabel: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          label="Start Time"
          placeholder="Select time"
        />
      </div>
    );
  },
};

/**
 * Required field
 */
export const Required: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          label="Meeting Time"
          required
          placeholder="Select time"
        />
      </div>
    );
  },
};

// ============================================================================
// Time Formats
// ============================================================================

/**
 * 12-hour format (default)
 */
export const Format12Hour: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          timeFormat="12"
          label="12-Hour Format"
          placeholder="Select time"
        />
      </div>
    );
  },
};

/**
 * 24-hour format
 */
export const Format24Hour: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          timeFormat="24"
          label="24-Hour Format"
          placeholder="Select time"
        />
      </div>
    );
  },
};

// ============================================================================
// Minute Steps
// ============================================================================

/**
 * 15-minute increments
 */
export const QuarterHourStep: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          minuteStep={15}
          label="Quarter Hours"
          placeholder="Select time"
        />
      </div>
    );
  },
};

/**
 * 30-minute increments
 */
export const HalfHourStep: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          minuteStep={30}
          label="Half Hours"
          placeholder="Select time"
        />
      </div>
    );
  },
};

/**
 * 5-minute increments
 */
export const FiveMinuteStep: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          minuteStep={5}
          label="5-Minute Steps"
          placeholder="Select time"
        />
      </div>
    );
  },
};

// ============================================================================
// Size Variants
// ============================================================================

/**
 * Small size
 */
export const SizeSmall: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[180px]">
        <TimePicker
          value={time}
          onChange={setTime}
          size="sm"
          label="Small"
          placeholder="Select time"
        />
      </div>
    );
  },
};

/**
 * Medium size (default)
 */
export const SizeMedium: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          size="md"
          label="Medium"
          placeholder="Select time"
        />
      </div>
    );
  },
};

/**
 * Large size
 */
export const SizeLarge: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[220px]">
        <TimePicker
          value={time}
          onChange={setTime}
          size="lg"
          label="Large"
          placeholder="Select time"
        />
      </div>
    );
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => {
    const [times, setTimes] = useState<{ sm?: Date; md?: Date; lg?: Date }>({});
    return (
      <div className="flex flex-col gap-4 w-[220px]">
        <TimePicker
          value={times.sm}
          onChange={(t) => setTimes((prev) => ({ ...prev, sm: t }))}
          size="sm"
          label="Small"
        />
        <TimePicker
          value={times.md}
          onChange={(t) => setTimes((prev) => ({ ...prev, md: t }))}
          size="md"
          label="Medium"
        />
        <TimePicker
          value={times.lg}
          onChange={(t) => setTimes((prev) => ({ ...prev, lg: t }))}
          size="lg"
          label="Large"
        />
      </div>
    );
  },
};

// ============================================================================
// States
// ============================================================================

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-[200px]">
      <TimePicker
        value={new Date()}
        disabled
        label="Disabled"
        placeholder="Cannot select"
      />
    </div>
  ),
};

/**
 * Error state
 */
export const WithError: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          error
          errorMessage="Please select a valid time"
          label="With Error"
          placeholder="Select time"
        />
      </div>
    );
  },
};

/**
 * Pre-selected value
 */
export const WithInitialValue: Story = {
  render: () => {
    const initialTime = new Date();
    initialTime.setHours(14, 30, 0, 0);
    const [time, setTime] = useState<Date>(initialTime);
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          label="Pre-selected"
          placeholder="Select time"
        />
      </div>
    );
  },
};

// ============================================================================
// Inline Time Picker
// ============================================================================

/**
 * Inline time picker
 */
export const Inline: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="border rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Inline time picker (no popover):
        </p>
        <InlineTimePicker
          value={time}
          onChange={setTime}
          timeFormat="12"
        />
        {time && (
          <p className="mt-4 text-sm text-muted-foreground">
            Selected: {time.toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  },
};

/**
 * Inline 24-hour format
 */
export const Inline24Hour: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="border rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-4">
          24-hour format:
        </p>
        <InlineTimePicker
          value={time}
          onChange={setTime}
          timeFormat="24"
        />
      </div>
    );
  },
};

// ============================================================================
// Real-World Examples
// ============================================================================

/**
 * Meeting scheduler
 */
export const MeetingScheduler: Story = {
  render: () => {
    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();

    return (
      <div className="flex gap-4 w-[440px]">
        <div className="flex-1">
          <TimePicker
            value={startTime}
            onChange={setStartTime}
            minuteStep={15}
            label="Start Time"
            placeholder="Start"
          />
        </div>
        <div className="flex-1">
          <TimePicker
            value={endTime}
            onChange={setEndTime}
            minuteStep={15}
            label="End Time"
            placeholder="End"
          />
        </div>
      </div>
    );
  },
};

/**
 * Business hours picker
 */
export const BusinessHours: Story = {
  render: () => {
    const morning = new Date();
    morning.setHours(9, 0, 0, 0);
    const evening = new Date();
    evening.setHours(17, 0, 0, 0);

    const [openTime, setOpenTime] = useState<Date>(morning);
    const [closeTime, setCloseTime] = useState<Date>(evening);

    return (
      <div className="flex gap-4 w-[440px]">
        <div className="flex-1">
          <TimePicker
            value={openTime}
            onChange={setOpenTime}
            minuteStep={30}
            label="Opening Time"
            placeholder="Opens at"
          />
        </div>
        <div className="flex-1">
          <TimePicker
            value={closeTime}
            onChange={setCloseTime}
            minuteStep={30}
            label="Closing Time"
            placeholder="Closes at"
          />
        </div>
      </div>
    );
  },
};

/**
 * Alarm time picker
 */
export const AlarmPicker: Story = {
  render: () => {
    const [alarm, setAlarm] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={alarm}
          onChange={setAlarm}
          minuteStep={5}
          size="lg"
          label="⏰ Set Alarm"
          placeholder="Select alarm time"
        />
      </div>
    );
  },
};

/**
 * Flight time selector
 */
export const FlightTime: Story = {
  render: () => {
    const [time, setTime] = useState<Date>();
    return (
      <div className="w-[200px]">
        <TimePicker
          value={time}
          onChange={setTime}
          timeFormat="24"
          minuteStep={5}
          label="Departure Time"
          placeholder="Select time"
        />
        <p className="text-xs text-muted-foreground mt-2">
          All times are in local timezone
        </p>
      </div>
    );
  },
};

/**
 * Shift schedule
 */
export const ShiftSchedule: Story = {
  render: () => {
    const shifts = [
      { label: "Morning Shift", start: { h: 6, m: 0 }, end: { h: 14, m: 0 } },
      { label: "Afternoon Shift", start: { h: 14, m: 0 }, end: { h: 22, m: 0 } },
      { label: "Night Shift", start: { h: 22, m: 0 }, end: { h: 6, m: 0 } },
    ];

    const [selectedShift, setSelectedShift] = useState(0);
    const [customStart, setCustomStart] = useState<Date>();
    const [customEnd, setCustomEnd] = useState<Date>();

    return (
      <div className="w-[500px] space-y-4">
        <div className="flex gap-2">
          {shifts.map((shift, index) => (
            <button
              key={shift.label}
              onClick={() => setSelectedShift(index)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedShift === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {shift.label}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <TimePicker
              value={customStart}
              onChange={setCustomStart}
              timeFormat="24"
              minuteStep={15}
              label="Custom Start"
              placeholder="Start time"
            />
          </div>
          <div className="flex-1">
            <TimePicker
              value={customEnd}
              onChange={setCustomEnd}
              timeFormat="24"
              minuteStep={15}
              label="Custom End"
              placeholder="End time"
            />
          </div>
        </div>
      </div>
    );
  },
};
