import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DateTimePicker } from "./index";
import {
  type DatePreset,
  addDays,
  addHours,
  subDays,
  startOfDay,
  endOfDay,
} from "../../lib/date-utils";

const meta: Meta<typeof DateTimePicker> = {
  title: "Inputs/DateTimePicker",
  component: DateTimePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A combined date and time selection component. Combines DatePicker calendar with TimePicker controls for selecting both date and time.",
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
      description: "Step for minutes",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    layout: {
      control: "select",
      options: ["tabs", "side-by-side"],
      description: "Layout for date/time selection",
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
    showDefaultPresets: {
      control: "boolean",
      description: "Show default quick presets",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

// ============================================================================
// Basic Stories
// ============================================================================

/**
 * Default datetime picker
 */
export const Default: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          placeholder="Select date and time"
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          label="Event Date & Time"
          placeholder="Select date and time"
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          label="Appointment"
          required
          placeholder="Select appointment time"
        />
      </div>
    );
  },
};

// ============================================================================
// Layout Variants
// ============================================================================

/**
 * Tabs layout (default)
 */
export const TabsLayout: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          layout="tabs"
          label="Tabs Layout"
          placeholder="Select date and time"
        />
      </div>
    );
  },
};

/**
 * Side-by-side layout
 */
export const SideBySideLayout: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[450px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          layout="side-by-side"
          label="Side-by-Side Layout"
          placeholder="Select date and time"
        />
      </div>
    );
  },
};

/**
 * Start on time tab
 */
export const StartOnTimeTab: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          defaultTab="time"
          label="Opens to Time Tab"
          placeholder="Select date and time"
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          timeFormat="12"
          label="12-Hour Format"
          placeholder="Select date and time"
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          timeFormat="24"
          label="24-Hour Format"
          placeholder="Select date and time"
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          minuteStep={15}
          label="15-Minute Steps"
          placeholder="Select date and time"
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          minuteStep={30}
          label="30-Minute Steps"
          placeholder="Select date and time"
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[280px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          size="sm"
          label="Small"
          placeholder="Select date and time"
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          size="md"
          label="Medium"
          placeholder="Select date and time"
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[320px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          size="lg"
          label="Large"
          placeholder="Select date and time"
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
    const [datetimes, setDatetimes] = useState<{ sm?: Date; md?: Date; lg?: Date }>({});
    return (
      <div className="flex flex-col gap-4 w-[320px]">
        <DateTimePicker
          value={datetimes.sm}
          onChange={(d) => setDatetimes((prev) => ({ ...prev, sm: d }))}
          size="sm"
          label="Small"
        />
        <DateTimePicker
          value={datetimes.md}
          onChange={(d) => setDatetimes((prev) => ({ ...prev, md: d }))}
          size="md"
          label="Medium"
        />
        <DateTimePicker
          value={datetimes.lg}
          onChange={(d) => setDatetimes((prev) => ({ ...prev, lg: d }))}
          size="lg"
          label="Large"
        />
      </div>
    );
  },
};

// ============================================================================
// Constraints
// ============================================================================

/**
 * With minimum date
 */
export const WithMinDate: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          minDate={new Date()}
          label="Future Only"
          placeholder="Select future date/time"
        />
      </div>
    );
  },
};

/**
 * With maximum date
 */
export const WithMaxDate: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          maxDate={new Date()}
          label="Past Only"
          placeholder="Select past date/time"
        />
      </div>
    );
  },
};

/**
 * Disabled weekends
 */
export const DisabledWeekends: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          disabledDaysOfWeek={[0, 6]}
          label="Weekdays Only"
          placeholder="Select a weekday"
        />
      </div>
    );
  },
};

// ============================================================================
// Presets
// ============================================================================

/**
 * With default presets
 */
export const WithDefaultPresets: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          showDefaultPresets
          label="With Presets"
          placeholder="Select date and time"
        />
      </div>
    );
  },
};

/**
 * With custom presets
 */
export const WithCustomPresets: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    
    const customPresets: DatePreset[] = [
      { label: "Now", value: () => new Date() },
      { label: "In 1 Hour", value: () => addHours(new Date(), 1) },
      { label: "Tomorrow 9 AM", value: () => {
        const tomorrow = addDays(new Date(), 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow;
      }},
      { label: "Next Week", value: () => addDays(new Date(), 7) },
    ];

    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          presets={customPresets}
          label="Custom Presets"
          placeholder="Select date and time"
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
    <div className="w-[300px]">
      <DateTimePicker
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
    const [datetime, setDatetime] = useState<Date>();
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          error
          errorMessage="Please select a valid date and time"
          label="With Error"
          placeholder="Select date and time"
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
    const initialDatetime = new Date();
    initialDatetime.setDate(initialDatetime.getDate() + 7);
    initialDatetime.setHours(14, 30, 0, 0);
    const [datetime, setDatetime] = useState<Date>(initialDatetime);
    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          label="Pre-selected"
          placeholder="Select date and time"
        />
      </div>
    );
  },
};

// ============================================================================
// Real-World Examples
// ============================================================================

/**
 * Appointment scheduler
 */
export const AppointmentScheduler: Story = {
  render: () => {
    const [datetime, setDatetime] = useState<Date>();
    
    const appointmentPresets: DatePreset[] = [
      { label: "Tomorrow Morning", value: () => {
        const d = addDays(new Date(), 1);
        d.setHours(9, 0, 0, 0);
        return d;
      }},
      { label: "Tomorrow Afternoon", value: () => {
        const d = addDays(new Date(), 1);
        d.setHours(14, 0, 0, 0);
        return d;
      }},
      { label: "Next Week", value: () => addDays(new Date(), 7) },
    ];

    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={datetime}
          onChange={setDatetime}
          presets={appointmentPresets}
          minDate={new Date()}
          disabledDaysOfWeek={[0]} // No Sundays
          minuteStep={15}
          label="Schedule Appointment"
          placeholder="Choose a time slot"
        />
      </div>
    );
  },
};

/**
 * Event creation
 */
export const EventCreation: Story = {
  render: () => {
    const [startDatetime, setStartDatetime] = useState<Date>();
    const [endDatetime, setEndDatetime] = useState<Date>();

    return (
      <div className="w-[640px] space-y-4">
        <h3 className="text-lg font-semibold">Create Event</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <DateTimePicker
              value={startDatetime}
              onChange={(date) => {
                setStartDatetime(date);
                // Auto-set end time 1 hour after start
                if (date && !endDatetime) {
                  setEndDatetime(addHours(date, 1));
                }
              }}
              minDate={new Date()}
              minuteStep={15}
              label="Start"
              placeholder="Event start"
            />
          </div>
          <div className="flex-1">
            <DateTimePicker
              value={endDatetime}
              onChange={setEndDatetime}
              minDate={startDatetime || new Date()}
              minuteStep={15}
              label="End"
              placeholder="Event end"
            />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Flight booking
 */
export const FlightBooking: Story = {
  render: () => {
    const [departure, setDeparture] = useState<Date>();

    const flightPresets: DatePreset[] = [
      { label: "Tomorrow", value: () => addDays(new Date(), 1) },
      { label: "This Weekend", value: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
        return addDays(today, daysUntilSaturday);
      }},
      { label: "Next Week", value: () => addDays(new Date(), 7) },
    ];

    return (
      <div className="w-[320px]">
        <DateTimePicker
          value={departure}
          onChange={setDeparture}
          presets={flightPresets}
          timeFormat="24"
          minuteStep={5}
          minDate={new Date()}
          layout="tabs"
          label="Departure"
          placeholder="Select departure date & time"
        />
        <p className="text-xs text-muted-foreground mt-2">
          All times are in local timezone
        </p>
      </div>
    );
  },
};

/**
 * Reminder setting
 */
export const ReminderSetting: Story = {
  render: () => {
    const [reminder, setReminder] = useState<Date>();

    const reminderPresets: DatePreset[] = [
      { label: "In 1 Hour", value: () => addHours(new Date(), 1) },
      { label: "Tomorrow 9 AM", value: () => {
        const d = addDays(new Date(), 1);
        d.setHours(9, 0, 0, 0);
        return d;
      }},
      { label: "In 3 Days", value: () => addDays(new Date(), 3) },
    ];

    return (
      <div className="w-[300px]">
        <DateTimePicker
          value={reminder}
          onChange={setReminder}
          presets={reminderPresets}
          minDate={new Date()}
          minuteStep={5}
          label="🔔 Set Reminder"
          placeholder="When to remind you?"
        />
      </div>
    );
  },
};

/**
 * Deadline picker
 */
export const DeadlinePicker: Story = {
  render: () => {
    const [deadline, setDeadline] = useState<Date>();

    return (
      <div className="w-[320px] p-4 border rounded-lg">
        <h3 className="text-sm font-medium mb-3">Task Deadline</h3>
        <DateTimePicker
          value={deadline}
          onChange={setDeadline}
          minDate={new Date()}
          showDefaultPresets
          timeFormat="12"
          layout="tabs"
          placeholder="Set deadline"
        />
        {deadline && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm">
              <span className="font-medium">Deadline set:</span>{" "}
              {deadline.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Scheduled publish
 */
export const ScheduledPublish: Story = {
  render: () => {
    const [publishTime, setPublishTime] = useState<Date>();
    const [publishNow, setPublishNow] = useState(true);

    return (
      <div className="w-[320px] space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => setPublishNow(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
              publishNow
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Publish Now
          </button>
          <button
            onClick={() => setPublishNow(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
              !publishNow
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Schedule
          </button>
        </div>
        
        {!publishNow && (
          <DateTimePicker
            value={publishTime}
            onChange={setPublishTime}
            minDate={new Date()}
            minuteStep={15}
            timeFormat="12"
            label="Publish Date & Time"
            placeholder="Schedule for later"
          />
        )}
      </div>
    );
  },
};
