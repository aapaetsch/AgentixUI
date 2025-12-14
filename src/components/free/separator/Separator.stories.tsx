import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./index";

/**
 * # Separator
 *
 * A visual divider that separates content into logical sections.
 * Can be oriented horizontally or vertically with custom color and opacity.
 *
 * ## Features
 * - Horizontal and vertical orientations
 * - Custom color support
 * - Custom opacity support
 * - Accessible by default
 *
 * ## Usage
 *
 * ```tsx
 * import { Separator } from "@/components/ui/separator"
 *
 * export function SeparatorDemo() {
 *   return (
 *     <div>
 *       <div className="space-y-1">
 *         <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
 *         <p className="text-sm text-muted-foreground">
 *           An open-source UI component library.
 *         </p>
 *       </div>
 *       <Separator className="my-4" />
 *       <div className="flex h-5 items-center space-x-4 text-sm">
 *         <div>Blog</div>
 *         <Separator orientation="vertical" />
 *         <div>Docs</div>
 *         <Separator orientation="vertical" />
 *         <div>Source</div>
 *       </div>
 *     </div>
 *   )
 * }
 * ```
 */
const meta: Meta<typeof Separator> = {
  title: "Free/Utils/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    color: {
      control: "text",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
    },
    decorative: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Separator>;

/**
 * The default separator is horizontal with default styling.
 */
export const Default: Story = {
  render: () => (
    <div className="w-full">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

/**
 * The separator can be oriented vertically to separate content horizontally.
 * Useful in toolbars, menus, and inline layouts.
 */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
};

/**
 * The separator can be customized with different colors using Tailwind CSS classes.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Primary Color</h4>
        <Separator color="bg-primary" className="my-2" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Destructive Color</h4>
        <Separator color="bg-destructive" className="my-2" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Custom Color</h4>
        <Separator color="bg-blue-500" className="my-2" />
      </div>
    </div>
  ),
};

/**
 * The separator can be customized with different opacity values.
 */
export const Opacity: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Default Opacity</h4>
        <Separator className="my-2" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">50% Opacity</h4>
        <Separator opacity={0.5} className="my-2" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">20% Opacity</h4>
        <Separator opacity={0.2} className="my-2" />
      </div>
    </div>
  ),
};

/**
 * The separator can be used in various contexts like form sections.
 */
export const FormSections: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <div>
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          Your personal details are kept private.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">First Name</label>
            <div className="mt-1 h-9 rounded-md border px-3 py-2 text-sm">
              John
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <div className="mt-1 h-9 rounded-md border px-3 py-2 text-sm">
              Doe
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <div className="mt-1 h-9 rounded-md border px-3 py-2 text-sm">
            john.doe@example.com
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div>
        <h3 className="text-lg font-medium">Work Information</h3>
        <p className="text-sm text-muted-foreground">
          Your professional details.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Company</label>
          <div className="mt-1 h-9 rounded-md border px-3 py-2 text-sm">
            Acme Inc.
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Role</label>
          <div className="mt-1 h-9 rounded-md border px-3 py-2 text-sm">
            Software Engineer
          </div>
        </div>
      </div>
    </div>
  ),
};