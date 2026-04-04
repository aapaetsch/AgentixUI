import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuShortcut,
} from "./index";
import {
  Copy,
  Clipboard,
  Trash2,
  Edit2,
  Download,
  File,
  Folder,
  Save,
  Settings,
  User,
  ChevronRight,
  Scissors,
  Maximize2,
  Play,
  Pause,
  Heart,
  Share2,
  Search,
  Globe,
  Moon,
  Sun,
  Undo,
  Redo,
  RotateCcw,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  RotateCw,
} from "lucide-react";

/**
 * ContextMenu provides a right-click action menu for web and Electron applications.
 * Built on Radix UI's ContextMenu primitive with project styling using CVA variants
 * and MD3 motion tokens.
 *
 * ## Features
 * - Right-click activation on trigger area
 * - Unbounded submenu nesting support
 * - Icon support with left-aligned icons
 * - Keyboard shortcuts with right-aligned shortcuts
 * - Checkable items (checkbox/radio)
 * - Disabled states and destructive variants
 * - Custom positioning API with automatic collision detection
 * - Configurable close delay
 * - Full keyboard navigation (Arrow keys, Enter, Escape)
 *
 * ## Usage
 *
 * ```tsx
 * import {
 *   ContextMenu,
 *   ContextMenuTrigger,
 *   ContextMenuContent,
 *   ContextMenuItem,
 *   ContextMenuShortcut,
 * } from '@aidan/ui';
 *
 * <ContextMenu>
 *   <ContextMenuTrigger>
 *     <div className="p-4 border rounded">
 *       Right click here
 *     </div>
 *   </ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem icon={<Copy />}>
 *       Copy
 *       <ContextMenuShortcut>⌘C</ContextMenuShortcut>
 *     </ContextMenuItem>
 *     <ContextMenuItem icon={<Clipboard />}>
 *       Paste
 *       <ContextMenuShortcut>⌘V</ContextMenuShortcut>
 *     </ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 * ```
 * ## Accessibility
 *
 * The ContextMenu component follows WAI-ARIA menu pattern:
 *
 * - **Keyboard Navigation:**
 *   - `ArrowDown` / `ArrowUp`: Navigate between items
 *   - `ArrowRight`: Open submenu
 *   - `ArrowLeft`: Close submenu
 *   - `Enter` / `Space`: Select item
 *   - `Escape`: Close menu
 *
 * - **Screen Reader Support:**
 *   - Proper ARIA roles (`role="menu"`, `role="menuitem"`)
 *   - Keyboard shortcuts are announced
 *   - State changes are communicated
 */
const meta: Meta<typeof ContextMenu> = {
  title: "Overlay/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

// =============================================================================
// Basic Examples
// =============================================================================

export const Default: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem icon={<Copy className="h-4 w-4" />}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Clipboard className="h-4 w-4" />}>
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem icon={<Scissors className="h-4 w-4" />}>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem icon={<Copy className="h-4 w-4" />}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Clipboard className="h-4 w-4" />} disabled>
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Scissors className="h-4 w-4" />} disabled>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

// =============================================================================
// Checkbox and Radio Items
// =============================================================================

export const WithCheckboxItems: Story = {
  render: () => {
    const [showBookmarks, setShowBookmarks] = React.useState(false);
    const [showURLs, setShowURLs] = React.useState(true);

    return (
      <div className="flex h-screen items-center justify-center">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-lg border-2 border-dashed text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>View Options</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem
              checked={showBookmarks}
              onCheckedChange={setShowBookmarks}
            >
              Show Bookmarks
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem
              checked={showURLs}
              onCheckedChange={setShowURLs}
            >
              Show Full URLs
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
};

export const WithRadioGroup: Story = {
  render: () => {
    const [theme, setTheme] = React.useState("light");

    return (
      <div className="flex h-screen items-center justify-center">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-lg border-2 border-dashed text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Theme</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
              <ContextMenuRadioItem value="light">
                Light
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="dark">
                Dark
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="system">
                System
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
};

// =============================================================================
// Submenus
// =============================================================================

export const Submenus: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem icon={<Play className="h-4 w-4" />}>
            Play
            <ContextMenuShortcut>Space</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Pause className="h-4 w-4" />}>
            Pause
            <ContextMenuShortcut>K</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              Playback Speed
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>0.5x</ContextMenuItem>
              <ContextMenuItem>0.75x</ContextMenuItem>
              <ContextMenuItem>Normal</ContextMenuItem>
              <ContextMenuItem>1.25x</ContextMenuItem>
              <ContextMenuItem>1.5x</ContextMenuItem>
              <ContextMenuItem>2x</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              More Tools
              <ContextMenuShortcut>⌘+T</ContextMenuShortcut>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem icon={<Download className="h-4 w-4" />}>
                Download Page...
              </ContextMenuItem>
              <ContextMenuItem icon={<Save className="h-4 w-4" />}>
                Save Page As...
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>Nested Menu</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem>Level 2 Item 1</ContextMenuItem>
                  <ContextMenuItem>Level 2 Item 2</ContextMenuItem>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>Deep Nesting</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem>Level 3 Item 1</ContextMenuItem>
                      <ContextMenuItem>Level 3 Item 2</ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive" icon={<Trash2 className="h-4 w-4" />}>
                Delete
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

// =============================================================================
// Destructive Items
// =============================================================================

export const Destructive: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem icon={<Copy className="h-4 w-4" />}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Edit2 className="h-4 w-4" />}>
            Rename
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" icon={<Trash2 className="h-4 w-4" />}>
            Delete
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

// =============================================================================
// File Actions Preset
// =============================================================================

export const FileActionsPreset: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-48 w-[32rem] items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Right click on a file
        </ContextMenuTrigger>
        <ContextMenuContent>
          {/* File actions */}
          <ContextMenuItem icon={<Copy className="h-4 w-4" />}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Clipboard className="h-4 w-4" />}>
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Scissors className="h-4 w-4" />}>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem icon={<Edit2 className="h-4 w-4" />}>
            Rename
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Maximize2 className="h-4 w-4" />}>
            Properties
            <ContextMenuShortcut>⌘I</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem icon={<Trash2 className="h-4 w-4" />} variant="destructive">
            Delete
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

// =============================================================================
// Text Editor Preset
// =============================================================================

export const TextEditorPreset: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-48 w-[32rem] items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Right click in text editor
        </ContextMenuTrigger>
        <ContextMenuContent>
          {/* Basic editing */}
          <ContextMenuItem icon={<Undo className="h-4 w-4" />}>
            Undo
            <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Redo className="h-4 w-4" />}>
            Redo
            <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          {/* Cut/Copy/Paste */}
          <ContextMenuItem icon={<Scissors className="h-4 w-4" />}>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Copy className="h-4 w-4" />}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Clipboard className="h-4 w-4" />}>
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          {/* Selection */}
          <ContextMenuItem>Select All</ContextMenuItem>
          <ContextMenuSeparator />
          {/* Find/Replace */}
          <ContextMenuItem icon={<Search className="h-4 w-4" />}>
            Find
            <ContextMenuShortcut>⌘F</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Search className="h-4 w-4" />}>
            Find and Replace
            <ContextMenuShortcut>⌘H</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

// =============================================================================
// Navigation Preset
// =============================================================================

export const NavigationPreset: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-48 w-96 items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Right click on page
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem icon={<ChevronLeft className="h-4 w-4" />}>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<ChevronRightIcon className="h-4 w-4" />}>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<RotateCcw className="h-4 w-4" />}>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              More Tools
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem icon={<Download className="h-4 w-4" />}>
                Save Page...
              </ContextMenuItem>
              <ContextMenuItem>Zoom In</ContextMenuItem>
              <ContextMenuItem>Zoom Out</ContextMenuItem>
              <ContextMenuItem>Full Screen</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Developer Tools</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

// =============================================================================
// Media Player Preset
// =============================================================================

export const MediaPlayerPreset: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-48 w-[32rem] items-center justify-center rounded-lg border-2 border-dashed text-sm">
          Right click on video
        </ContextMenuTrigger>
        <ContextMenuContent>
          {/* Playback controls */}
          <ContextMenuItem icon={<Play className="h-4 w-4" />}>
            Play
            <ContextMenuShortcut>Space</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Pause className="h-4 w-4" />}>
            Pause
            <ContextMenuShortcut>K</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Playback Speed</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>0.25x</ContextMenuItem>
              <ContextMenuItem>0.5x</ContextMenuItem>
              <ContextMenuItem>0.75x</ContextMenuItem>
              <ContextMenuItem>Normal</ContextMenuItem>
              <ContextMenuItem>1.25x</ContextMenuItem>
              <ContextMenuItem>1.5x</ContextMenuItem>
              <ContextMenuItem>2x</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          {/* Actions */}
          <ContextMenuItem icon={<Heart className="h-4 w-4" />}>
            Add to Favorites
          </ContextMenuItem>
          <ContextMenuItem icon={<Share2 className="h-4 w-4" />}>
            Share
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem icon={<Download className="h-4 w-4" />}>
            Download
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          {/* Quality */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>Quality</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>1080p</ContextMenuItem>
              <ContextMenuItem>720p</ContextMenuItem>
              <ContextMenuItem>480p</ContextMenuItem>
              <ContextMenuItem>360p</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};

// =============================================================================
// Complex Example
// =============================================================================

export const ComplexExample: Story = {
  render: () => {
    const [showBookmarks, setShowBookmarks] = React.useState(false);
    const [showURLs, setShowURLs] = React.useState(true);
    const [theme, setTheme] = React.useState("light");

    return (
      <div className="flex h-screen items-center justify-center">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-48 w-[32rem] items-center justify-center rounded-lg border-2 border-dashed text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            {/* Navigation */}
            <ContextMenuItem inset>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            {/* Submenu */}
            <ContextMenuSub>
              <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-44">
                <ContextMenuItem icon={<Save className="h-4 w-4" />}>
                  Save Page...
                </ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Developer Tools</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">
                  Delete
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            {/* Checkbox items */}
            <ContextMenuCheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
              Show Bookmarks
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem checked={showURLs} onCheckedChange={setShowURLs}>
              Show Full URLs
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            {/* Radio group */}
            <ContextMenuLabel inset>Theme</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
              <ContextMenuRadioItem value="light">
                Light
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="dark">
                Dark
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="system">
                System
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  },
};