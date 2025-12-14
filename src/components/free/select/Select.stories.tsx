import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ChevronDown,
  ChevronsUpDown,
  ArrowDown,
  Settings,
  User,
  Mail,
  Phone,
  Home,
  Building,
  Flag,
  Globe,
  Palette,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./index";

/**
 * A dropdown select component following Material Design 3 patterns.
 * Built on Radix UI Select primitive with custom styling and size variants.
 *
 * ## Features
 * - 5 sizes matching Button component: `xs`, `sm`, `md`, `lg`, `xl` (using rem units)
 * - Custom dropdown icon support
 * - Grouping with `SelectGroup` and `SelectLabel`
 * - Separators for visual grouping
 * - Keyboard navigation and accessibility
 * - M3 motion for open/close animations
 * - Custom positioning via Radix UI popper
 */
const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="option2">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================================================
// Size Variants
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-16">xs (28px):</span>
        <Select>
          <SelectTrigger size="xs" className="w-[140px]">
            <SelectValue placeholder="Extra small" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-16">sm (32px):</span>
        <Select>
          <SelectTrigger size="sm" className="w-[160px]">
            <SelectValue placeholder="Small" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-16">md (36px):</span>
        <Select>
          <SelectTrigger size="md" className="w-[180px]">
            <SelectValue placeholder="Medium (default)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-16">lg (44px):</span>
        <Select>
          <SelectTrigger size="lg" className="w-[200px]">
            <SelectValue placeholder="Large" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-16">xl (52px):</span>
        <Select>
          <SelectTrigger size="xl" className="w-[220px]">
            <SelectValue placeholder="Extra large" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

// ============================================================================
// Custom Icons
// ============================================================================

export const CustomIcons: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-32">Default (ChevronDown):</span>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-32">ChevronsUpDown:</span>
        <Select>
          <SelectTrigger icon={ChevronsUpDown} className="w-[180px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-32">ArrowDown:</span>
        <Select>
          <SelectTrigger icon={ArrowDown} className="w-[180px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-32">No icon:</span>
        <Select>
          <SelectTrigger hideIcon className="w-[180px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

// ============================================================================
// Grouping
// ============================================================================

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a contact" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Personal</SelectLabel>
          <SelectItem value="email">
            <Mail className="mr-2" />
            Email
          </SelectItem>
          <SelectItem value="phone">
            <Phone className="mr-2" />
            Phone
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Address</SelectLabel>
          <SelectItem value="home">
            <Home className="mr-2" />
            Home
          </SelectItem>
          <SelectItem value="work">
            <Building className="mr-2" />
            Work
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const MultipleGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="ist">India Standard Time (IST)</SelectItem>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// ============================================================================
// States
// ============================================================================

export const DisabledTrigger: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange" disabled>
          Orange (Out of stock)
        </SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="mango" disabled>
          Mango (Seasonal)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================================================
// Controlled
// ============================================================================

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("light");
    return (
      <div className="flex flex-col items-center gap-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <Sun className="mr-2" />
              Light
            </SelectItem>
            <SelectItem value="dark">
              <Moon className="mr-2" />
              Dark
            </SelectItem>
            <SelectItem value="system">
              <Monitor className="mr-2" />
              System
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Current value: <strong>{value}</strong>
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs bg-secondary rounded"
            onClick={() => setValue("light")}
          >
            Set Light
          </button>
          <button
            className="px-3 py-1 text-xs bg-secondary rounded"
            onClick={() => setValue("dark")}
          >
            Set Dark
          </button>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Positioning
// ============================================================================

export const Positioning: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">
        Different positioning options for the dropdown
      </p>
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Bottom Start</span>
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent side="bottom" align="start">
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Bottom Center</span>
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent side="bottom" align="center">
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Bottom End</span>
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent side="bottom" align="end">
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  ),
};

// ============================================================================
// With Icons in Items
// ============================================================================

export const WithIconsInItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select setting" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="profile">
          <User className="mr-2" />
          Profile
        </SelectItem>
        <SelectItem value="settings">
          <Settings className="mr-2" />
          Settings
        </SelectItem>
        <SelectItem value="theme">
          <Palette className="mr-2" />
          Theme
        </SelectItem>
        <SelectItem value="language">
          <Globe className="mr-2" />
          Language
        </SelectItem>
        <SelectItem value="region">
          <Flag className="mr-2" />
          Region
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================================================
// Long Lists
// ============================================================================

export const LongList: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="au">Australia</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="jp">Japan</SelectItem>
        <SelectItem value="cn">China</SelectItem>
        <SelectItem value="in">India</SelectItem>
        <SelectItem value="br">Brazil</SelectItem>
        <SelectItem value="mx">Mexico</SelectItem>
        <SelectItem value="kr">South Korea</SelectItem>
        <SelectItem value="it">Italy</SelectItem>
        <SelectItem value="es">Spain</SelectItem>
        <SelectItem value="nl">Netherlands</SelectItem>
        <SelectItem value="se">Sweden</SelectItem>
        <SelectItem value="no">Norway</SelectItem>
        <SelectItem value="dk">Denmark</SelectItem>
        <SelectItem value="fi">Finland</SelectItem>
        <SelectItem value="nz">New Zealand</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================================================
// Form Example
// ============================================================================

export const FormExample: Story = {
  render: () => (
    <form className="flex flex-col gap-4 w-[300px]">
      <div className="flex flex-col gap-2">
        <label htmlFor="country" className="text-sm font-medium">
          Country
        </label>
        <Select>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="language" className="text-sm font-medium">
          Language
        </label>
        <Select defaultValue="en">
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="timezone" className="text-sm font-medium">
          Timezone
        </label>
        <Select>
          <SelectTrigger id="timezone" size="sm">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Americas</SelectLabel>
              <SelectItem value="est">Eastern Time</SelectItem>
              <SelectItem value="cst">Central Time</SelectItem>
              <SelectItem value="pst">Pacific Time</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="gmt">GMT</SelectItem>
              <SelectItem value="cet">CET</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </form>
  ),
};

// ============================================================================
// Interactive Showcase
// ============================================================================

export const InteractiveShowcase: Story = {
  render: () => {
    const [size, setSize] = React.useState<"xs" | "sm" | "md" | "lg" | "xl">("md");
    const [showIcon, setShowIcon] = React.useState(true);
    const [iconType, setIconType] = React.useState<"chevron" | "chevrons" | "arrow" | "animated">("chevron");
    const [animationPreset, setAnimationPreset] = React.useState<"smooth" | "bounce" | "sharp">("smooth");
    
    const getIcon = () => {
      switch (iconType) {
        case "chevrons":
          return ChevronsUpDown;
        case "arrow":
          return ArrowDown;
        default:
          return ChevronDown;
      }
    };

    return (
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-lg font-medium">Interactive Select Demo</h3>
          <p className="text-sm text-muted-foreground">
            Customize the select component below
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">Size</span>
            <select
              className="px-2 py-1 text-sm border rounded"
              value={size}
              onChange={(e) => setSize(e.target.value as typeof size)}
            >
              <option value="xs">xs (28px)</option>
              <option value="sm">sm (32px)</option>
              <option value="md">md (36px)</option>
              <option value="lg">lg (44px)</option>
              <option value="xl">xl (52px)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">Icon Type</span>
            <select
              className="px-2 py-1 text-sm border rounded"
              value={iconType}
              onChange={(e) => setIconType(e.target.value as typeof iconType)}
            >
              <option value="chevron">ChevronDown (rotate)</option>
              <option value="chevrons">ChevronsUpDown</option>
              <option value="arrow">ArrowDown</option>
              <option value="animated">AnimatedChevron (morph)</option>
            </select>
          </div>
          {iconType === "animated" && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium">Animation</span>
              <select
                className="px-2 py-1 text-sm border rounded"
                value={animationPreset}
                onChange={(e) => setAnimationPreset(e.target.value as typeof animationPreset)}
              >
                <option value="smooth">Smooth</option>
                <option value="bounce">Bounce</option>
                <option value="sharp">Sharp</option>
              </select>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showIcon"
              checked={showIcon}
              onChange={(e) => setShowIcon(e.target.checked)}
            />
            <label htmlFor="showIcon" className="text-sm">Show Icon</label>
          </div>
        </div>

        {/* Preview */}
        <div className="p-8 border rounded-lg bg-background">
          <Select>
            <SelectTrigger
              size={size}
              icon={iconType !== "animated" ? getIcon() : undefined}
              hideIcon={!showIcon}
              useAnimatedChevron={iconType === "animated"}
              chevronAnimation={animationPreset}
              className="w-[200px]"
            >
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Vegetables</SelectLabel>
                <SelectItem value="carrot">Carrot</SelectItem>
                <SelectItem value="broccoli">Broccoli</SelectItem>
                <SelectItem value="spinach">Spinach</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Animated Chevron
// ============================================================================

export const AnimatedChevronVariant: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <p className="text-sm text-muted-foreground">
        The AnimatedChevron uses a morphing animation instead of rotation.
        Click to see the effect.
      </p>
      <div className="flex flex-wrap items-start gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Smooth</span>
          <Select>
            <SelectTrigger useAnimatedChevron chevronAnimation="smooth" className="w-[180px]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Bounce</span>
          <Select>
            <SelectTrigger useAnimatedChevron chevronAnimation="bounce" className="w-[180px]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Sharp</span>
          <Select>
            <SelectTrigger useAnimatedChevron chevronAnimation="sharp" className="w-[180px]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  ),
};

export const AnimatedChevronSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Select key={size}>
          <SelectTrigger size={size} useAnimatedChevron className="w-[200px]">
            <SelectValue placeholder={`Size: ${size}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      ))}
    </div>
  ),
};
