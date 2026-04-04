# Context Menu Component

A context menu component providing right-click action menus for web and Electron applications. Built on Radix UI's ContextMenu primitive with project styling using CVA variants, Tailwind CSS, and Material Design 3 motion tokens.

## Features

- **Right-click activation** - Open on context menu trigger with mouse or keyboard
- **Unbounded submenu nesting** - Support for arbitrarily deep submenu levels
- **Icon support** - Left-aligned icons for visual action indicators
- **Keyboard shortcuts** - Right-aligned shortcuts for power users
- **Checkable items** - Checkbox and radio group support for settings/toggles
- **Disabled states** - Visual feedback for non-interactive items
- **Destructive variants** - Warning styling for dangerous actions
- **Full keyboard navigation** - Arrow keys, Enter, Escape, and more
- **Accessible** - WAI-ARIA compliant with screen reader support
- **Programmatic positioning** - Custom x/y coordinates (prepared for future)
- **Configurable close delay** - Adjust behavior on hover-off (prepared for future)

## Installation

The component is part of the @agentix/ui library. Ensure you have installed the package:

```bash
npm install @agentix/ui @radix-ui/react-context-menu
```

## Basic Usage

### Simple Context Menu

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@agentix/ui';

function App() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-4 border rounded">
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuItem>Cut</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

### With Icons and Shortcuts

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
} from '@agentix/ui';
import { Copy, Clipboard } from 'lucide-react';

function App() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-4 border rounded">
          Right click for actions
        </div>
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
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

### With Checkbox Items

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuCheckboxItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from '@agentix/ui';

function App() {
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showURLs, setShowURLs] = useState(true);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-4 border rounded">Right click for view options</div>
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
  );
}
```

### With Radio Group

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from '@agentix/ui';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-4 border rounded">Right click for theme options</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Theme</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
          <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
          <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
          <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

### With Submenus

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator,
} from '@agentix/ui';
import { Download, Save, Trash2 } from 'lucide-react';

function App() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-4 border rounded">Right click</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem icon={<Download className="h-4 w-4" />}>
              Download Page...
            </ContextMenuItem>
            <ContextMenuItem icon={<Save className="h-4 w-4" />}>
              Save Page As...
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive" icon={<Trash2 className="h-4 w-4" />}>
              Delete
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Pre-configured Presets

### File Actions Preset

A typical file manager context menu with copy, paste, rename, and delete:

```tsx
import { Copy, Clipboard, Edit2, Maximize2, Trash2 } from 'lucide-react';

<ContextMenuContent>
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
```

### Text Editor Preset

A standard text editor context menu with undo, redo, cut, copy, paste, and find:

```tsx
import { Undo, Redo, Scissors, Copy, Clipboard, Search } from 'lucide-react';

<ContextMenuContent>
  <ContextMenuItem icon={<Undo className="h-4 w-4" />}>
    Undo
    <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
  </ContextMenuItem>
  <ContextMenuItem icon={<Redo className="h-4 w-4" />}>
    Redo
    <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
  </ContextMenuItem>
  <ContextMenuSeparator />
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
  <ContextMenuItem>Select All</ContextMenuItem>
  <ContextMenuSeparator />
  <ContextMenuItem icon={<Search className="h-4 w-4" />}>
    Find
    <ContextMenuShortcut>⌘F</ContextMenuShortcut>
  </ContextMenuItem>
  <ContextMenuItem icon={<Search className="h-4 w-4" />}>
    Find and Replace
    <ContextMenuShortcut>⌘H</ContextMenuShortcut>
  </ContextMenuItem>
</ContextMenuContent>
```

### Navigation Preset

Browser-like navigation context menu with back, forward, reload, and tools:

```tsx
import { ChevronLeft, ChevronRight, RotateCcw, Globe } from 'lucide-react';

<ContextMenuContent>
  <ContextMenuItem icon={<ChevronLeft className="h-4 w-4" />}>
    Back
    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
  </ContextMenuItem>
  <ContextMenuItem icon={<ChevronRight className="h-4 w-4" />}>
    Forward
    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
  </ContextMenuItem>
  <ContextMenuItem icon={<RotateCcw className="h-4 w-4" />}>
    Reload
    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
  </ContextMenuItem>
  <ContextMenuSeparator />
  <ContextMenuSub>
    <ContextMenuSubTrigger icon={<Globe className="h-4 w-4" />}>
      More Tools
    </ContextMenuSubTrigger>
    <ContextMenuSubContent>
      <ContextMenuItem>Download...</ContextMenuItem>
      <ContextMenuItem>Zoom In</ContextMenuItem>
      <ContextMenuItem>Zoom Out</ContextMenuItem>
      <ContextMenuItem>Full Screen</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem>Developer Tools</ContextMenuItem>
    </ContextMenuSubContent>
  </ContextMenuSub>
</ContextMenuContent>
```

## API Reference

### ContextMenu

Root component for the context menu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Menu content and trigger |
| `position` | `\{ x: number; y: number \} \| null` | `null` | Custom x/y coordinates (prepared for future) |
| `delayClose` | `number` | `0` | Close delay in milliseconds (prepared for future) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `dir` | `'ltr' \| 'rtl'` | - | Text direction |
| `modal` | `boolean` | - | Whether menu is modal |

### ContextMenuTrigger

Wraps the element that triggers the context menu on right-click.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props with child element |
| `disabled` | `boolean` | `false` | Whether trigger is disabled |
| `className` | `string` | - | Custom classes |

### ContextMenuContent

The main menu container that displays the menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sideOffset` | `number` | `4` | Distance from cursor in pixels |
| `alignOffset` | `number` | `-4` | Offset from alignment axis |
| `collisionPadding` | `number \| Padding` | - | Collision boundary padding |
| `loop` | `boolean` | - | Loop keyboard navigation |
| `className` | `string` | - | Custom classes |

### ContextMenuItem

Individual action item with optional icon and shortcuts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode` | - | Left-aligned icon |
| `inset` | `boolean` | `false` | Adds 8px left padding |
| `variant` | `'default' \| 'destructive'` | `'default'` | Visual style |
| `disabled` | `boolean` | `false` | Whether item is disabled |
| `onSelect` | `() => void` | - | Callback when item is selected |
| `textValue` | `string` | - | Accessible text value |
| `className` | `string` | - | Custom classes |

### ContextMenuCheckboxItem

Toggleable item with checkbox indicator.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Whether checkbox is checked |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked changes |
| `icon` | `React.ReactNode` | - | Left-aligned icon |
| `inset` | `boolean` | `false` | Adds 8px left padding |
| `variant` | `'default' \| 'destructive'` | `'default'` | Visual style |
| `disabled` | `boolean` | `false` | Whether item is disabled |
| `className` | `string` | - | Custom classes |

### ContextMenuRadioGroup

Groups radio items together.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Currently selected value |
| `onValueChange` | `(value: string) => void` | - | Callback when value changes |
| `disabled` | `boolean` | `false` | Whether group is disabled |

### ContextMenuRadioItem

Radio button item (no icon prop - uses Dot indicator).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Radio button value |
| `inset` | `boolean` | `false` | Adds 8px left padding |
| `disabled` | `boolean` | `false` | Whether item is disabled |
| `className` | `string` | - | Custom classes |

### ContextMenuLabel

Non-interactive label for grouping items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Adds 8px left padding |
| `className` | `string` | - | Custom classes |

### ContextMenuSeparator

Visual divider between menu sections.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Custom classes |

### ContextMenuSub

Root component for submenus (supports unbounded nesting).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open changes |

### ContextMenuSubTrigger

Trigger for opening a submenu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Adds 8px left padding |
| `disabled` | `boolean` | `false` | Whether trigger is disabled |
| `className` | `string` | - | Custom classes |

### ContextMenuSubContent

Content container for submenu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sideOffset` | `number` | `4` | Distance from parent |
| `alignOffset` | `number` | `-4` | Offset from alignment axis |
| `collisionPadding` | `number \| Padding` | - | Collision boundary |
| `className` | `string` | - | Custom classes |

### ContextMenuShortcut

Keyboard shortcut indicator (right-aligned).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Custom classes |

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Opens context menu (when trigger has focus) |
| `Shift+Tab` | Opens context menu (when trigger has focus) |
| `ArrowDown` | Move to next item |
| `ArrowUp` | Move to previous item |
| `ArrowRight` | Open submenu |
| `ArrowLeft` | Close submenu or navigate to parent |
| `Enter` | Select focused item |
| `Space` | Select focused item |
| `Escape` | Close menu |
| `Home` | Move to first item |
| `End` | Move to last item |

### ARIA Attributes

The component uses proper ARIA roles:

- `role="menu"` - Menu container
- `role="menuitem"` - Action items
- `role="menuitemcheckbox"` - Checkbox items
- `role="menuitemradio"` - Radio items
- `aria-haspopup="true"` - Submenu triggers
- `aria-expanded` - Submenu open state
- `aria-checked` - Checkbox/radio state

### Screen Reader Support

- All items are keyboard accessible
- Keyboard shortcuts are announced
- State changes are communicated
- Menu structure is properly exposed

## Styling

### Custom Classes

All components accept a `className` prop for custom styling:

```tsx
<ContextMenuContent className="w-64 bg-purple-50">
  <ContextMenuItem className="text-purple-900">
    Custom styled item
  </ContextMenuItem>
</ContextMenuContent>
```

### Design Tokens

The component uses these CSS variables from your design system:

- `--radius` - Border radius (default: 0.5rem)
- `--border` - Border color
- `--popover` - Background color
- `--popover-foreground` - Text color
- `--accent` - Hover background
- `--accent-foreground` - Hover text
- `--elevation-2` - Shadow depth
- `--motion-duration-short` - Hover animation (100ms)
- `--motion-duration-medium` - Open/close animation (200ms)
- `--motion-easing-standard` - Easing function

### Tailwind Classes

Predefined Tailwind classes are used for:

- Spacing: `p-2`, `py-1.5`, `pl-2`, `pr-8`
- Typography: `text-sm`, `text-xs`, `font-semibold`
- Border: `border`, `rounded-[var(--radius)]`
- Shadow: `shadow-[var(--elevation-2)]`
- States: `hover:bg-accent`, `disabled:opacity-50`
- Animation: `transition-colors`, `duration-[var(--motion-duration-short)]`

## Platform Compatibility

### Web Browsers

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Right-click to open
- Long-press on touch devices

### Electron

- Fully compatible
- Same behavior as web browsers
- No additional configuration needed
- Integrates with Electron's context menu system

## Examples

### Complete File Manager Example

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@agentix/ui';
import { Copy, Clipboard, Edit2, Maximize2, Trash2, Scissors } from 'lucide-react';

function FileManager() {
  const handleCopy = () => console.log('Copy');
  const handlePaste = () => console.log('Paste');
  const handleDelete = () => console.log('Delete');

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-8 border rounded-lg">
          📁 My Documents
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<Copy className="h-4 w-4" />} onSelect={handleCopy}>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem icon={<Clipboard className="h-4 w-4" />} onSelect={handlePaste}>
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
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          icon={<Trash2 className="h-4 w-4" />}
          variant="destructive"
          onSelect={handleDelete}
        >
          Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Troubleshooting

### Menu Not Appearing

1. Ensure `ContextMenuTrigger` wraps the target element
2. Check that `ContextMenuContent` is a child of `ContextMenu`
3. Verify no z-index conflicts with other elements
4. Test with right-click only (not left-click)

### Submenu Not Opening

1. Ensure `ContextMenuSubContent` is a child of `ContextMenuSub`
2. Use `ContextMenuSubTrigger` as trigger component
3. Check for collision padding issues
4. Verify submenu content is not empty

### Keyboard Navigation Not Working

1. Ensure trigger has `tabIndex={0 if needed}`
2. Check for focus conflicts with other elements
3. Verify no disabled state on items
4. Test with Tab to focus, then Shift+Tab to open menu

## Related Components

- **Popover** - Hover/click-triggered floating content
- **Dropdown Menu** - Click-triggered menu (coming soon)
- **Select** - Form control dropdown
- **Tooltip** - Hover information popover