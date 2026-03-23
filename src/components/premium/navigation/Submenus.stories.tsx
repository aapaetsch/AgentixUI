import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Settings,
  Users,
  Shield,
  Bell,
  Mail,
  Calendar,
  BarChart3,
  Home,
  Inbox,
  Send,
  Star,
  Trash,
  Tag,
} from "lucide-react";

import {
  PremiumNavItem,
  PremiumNavItemWithSubmenu,
  PremiumNavSection,
  PremiumSubmenuItem,
} from "./index";
import { NavigationProvider } from "../../free/navigation";

// ============================================================================
// Meta
// ============================================================================

const meta = {
  title: "Premium/Navigation/Submenus",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Premium navigation with expandable submenu support using accordion functionality.

## Features
- **Custom Icons**: Define custom expand/collapse icons
- **Animated Chevron**: Use the built-in AnimatedChevron for smooth transitions
- **Nested Items**: Unlimited nesting levels with proper indentation
- **Controlled/Uncontrolled**: Supports both state management approaches
- **Accessibility**: Full keyboard navigation and ARIA support
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Stories: Custom Icons
// ============================================================================

export const CustomIcons: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="documents">
      <div className="w-[280px] p-4 border rounded-lg space-y-1">
        <PremiumNavItemWithSubmenu
          id="files"
          label="Files"
          icon={<Folder className="size-4" />}
          expandIcon={<ChevronRight className="size-4" />}
          collapseIcon={<ChevronDown className="size-4" />}
          animated={false}
        >
          <PremiumSubmenuItem
            id="documents"
            label="Documents"
            icon={<FileText className="size-4" />}
          />
          <PremiumSubmenuItem
            id="images"
            label="Images"
            icon={<Image className="size-4" />}
          />
          <PremiumSubmenuItem
            id="videos"
            label="Videos"
            icon={<Video className="size-4" />}
          />
          <PremiumSubmenuItem
            id="music"
            label="Music"
            icon={<Music className="size-4" />}
          />
        </PremiumNavItemWithSubmenu>

        <PremiumNavItemWithSubmenu
          id="settings"
          label="Settings"
          icon={<Settings className="size-4" />}
          expandIcon={<Plus className="size-4" />}
          collapseIcon={<Minus className="size-4" />}
          animated={false}
        >
          <PremiumSubmenuItem
            id="profile"
            label="Profile"
            icon={<Users className="size-4" />}
          />
          <PremiumSubmenuItem
            id="security"
            label="Security"
            icon={<Shield className="size-4" />}
          />
          <PremiumSubmenuItem
            id="notifications"
            label="Notifications"
            icon={<Bell className="size-4" />}
          />
        </PremiumNavItemWithSubmenu>
      </div>
    </NavigationProvider>
  ),
};

export const AnimatedChevron: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="images">
      <div className="w-[280px] p-4 border rounded-lg space-y-1">
        <PremiumNavItemWithSubmenu
          id="files"
          label="Files"
          icon={<Folder className="size-4" />}
          animated
        >
          <PremiumSubmenuItem
            id="documents"
            label="Documents"
            icon={<FileText className="size-4" />}
          />
          <PremiumSubmenuItem
            id="images"
            label="Images"
            icon={<Image className="size-4" />}
          />
          <PremiumSubmenuItem
            id="videos"
            label="Videos"
            icon={<Video className="size-4" />}
          />
        </PremiumNavItemWithSubmenu>

        <PremiumNavItemWithSubmenu
          id="settings"
          label="Settings"
          icon={<Settings className="size-4" />}
          animated
        >
          <PremiumSubmenuItem
            id="profile"
            label="Profile"
            icon={<Users className="size-4" />}
          />
          <PremiumSubmenuItem
            id="security"
            label="Security"
            icon={<Shield className="size-4" />}
          />
        </PremiumNavItemWithSubmenu>
      </div>
    </NavigationProvider>
  ),
};

// ============================================================================
// Stories: Variants
// ============================================================================

export const SubtleVariant: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="documents">
      <div className="w-[280px] p-4 border rounded-lg space-y-1">
        <PremiumNavItemWithSubmenu
          id="files"
          label="Files"
          icon={<Folder className="size-4" />}
          animated
          variant="subtle"
        >
          <PremiumSubmenuItem
            id="documents"
            label="Documents"
            icon={<FileText className="size-4" />}
            variant="subtle"
          />
          <PremiumSubmenuItem
            id="images"
            label="Images"
            icon={<Image className="size-4" />}
            variant="subtle"
          />
          <PremiumSubmenuItem
            id="videos"
            label="Videos"
            icon={<Video className="size-4" />}
            variant="subtle"
          />
        </PremiumNavItemWithSubmenu>
      </div>
    </NavigationProvider>
  ),
};

export const FilledWithIndicator: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="images">
      <div className="w-[280px] p-4 border rounded-lg space-y-1">
        <PremiumNavItemWithSubmenu
          id="files"
          label="Files"
          icon={<Folder className="size-4" />}
          animated
          variant="filled"
          indicator="left"
        >
          <PremiumSubmenuItem
            id="documents"
            label="Documents"
            icon={<FileText className="size-4" />}
            indicator="left"
          />
          <PremiumSubmenuItem
            id="images"
            label="Images"
            icon={<Image className="size-4" />}
            indicator="left"
          />
          <PremiumSubmenuItem
            id="videos"
            label="Videos"
            icon={<Video className="size-4" />}
            indicator="left"
          />
        </PremiumNavItemWithSubmenu>
      </div>
    </NavigationProvider>
  ),
};

export const GhostWithDotIndicator: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="inbox">
      <div className="w-[280px] p-4 border rounded-lg space-y-1">
        <PremiumNavItem
          id="home"
          label="Home"
          icon={<Home className="size-4" />}
          variant="ghost"
        />
        <PremiumNavItemWithSubmenu
          id="mail"
          label="Mail"
          icon={<Mail className="size-4" />}
          animated
          variant="ghost"
        >
          <PremiumSubmenuItem
            id="inbox"
            label="Inbox"
            icon={<Inbox className="size-4" />}
            variant="ghost"
            indicator="dot"
          />
          <PremiumSubmenuItem
            id="sent"
            label="Sent"
            icon={<Send className="size-4" />}
            variant="ghost"
            indicator="dot"
          />
          <PremiumSubmenuItem
            id="starred"
            label="Starred"
            icon={<Star className="size-4" />}
            variant="ghost"
            indicator="dot"
          />
          <PremiumSubmenuItem
            id="trash"
            label="Trash"
            icon={<Trash className="size-4" />}
            variant="ghost"
            indicator="dot"
          />
        </PremiumNavItemWithSubmenu>
      </div>
    </NavigationProvider>
  ),
};

// ============================================================================
// Stories: Nested Submenus
// ============================================================================

export const NestedSubmenus: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="family-photos">
      <div className="w-[280px] p-4 border rounded-lg space-y-1">
        <PremiumNavItemWithSubmenu
          id="files"
          label="My Files"
          icon={<Folder className="size-4" />}
          animated
          variant="subtle"
          indicator="left"
        >
          <PremiumSubmenuItem
            id="documents"
            label="Documents"
            icon={<FileText className="size-4" />}
            variant="subtle"
            indicator="left"
          />
          
          <PremiumNavItemWithSubmenu
            id="media"
            label="Media"
            icon={<FolderOpen className="size-4" />}
            animated
            variant="subtle"
            indicator="left"
            level={1}
          >
            <PremiumSubmenuItem
              id="family-photos"
              label="Family Photos"
              icon={<Image className="size-4" />}
              variant="subtle"
              indicator="left"
            />
            <PremiumSubmenuItem
              id="vacation-videos"
              label="Vacation Videos"
              icon={<Video className="size-4" />}
              variant="subtle"
              indicator="left"
            />
            <PremiumSubmenuItem
              id="playlist"
              label="Music Playlist"
              icon={<Music className="size-4" />}
              variant="subtle"
              indicator="left"
            />
          </PremiumNavItemWithSubmenu>

          <PremiumSubmenuItem
            id="archives"
            label="Archives"
            icon={<Archive className="size-4" />}
            variant="subtle"
            indicator="left"
          />
        </PremiumNavItemWithSubmenu>
      </div>
    </NavigationProvider>
  ),
};

// ============================================================================
// Stories: Sections with Submenus
// ============================================================================

export const SectionsWithSubmenus: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="inbox">
      <div className="w-[280px] p-4 border rounded-lg space-y-4">
        <PremiumNavSection title="Communication">
          <PremiumNavItem
            id="inbox"
            label="Inbox"
            icon={<Mail className="size-4" />}
            variant="subtle"
            indicator="left"
          />
          <PremiumNavItem
            id="calendar"
            label="Calendar"
            icon={<Calendar className="size-4" />}
            variant="subtle"
            indicator="left"
          />
        </PremiumNavSection>

        <PremiumNavSection title="Files">
          <PremiumNavItemWithSubmenu
            id="my-files"
            label="My Files"
            icon={<Folder className="size-4" />}
            animated
            variant="subtle"
            indicator="left"
          >
            <PremiumSubmenuItem
              id="documents-section"
              label="Documents"
              icon={<FileText className="size-4" />}
              variant="subtle"
              indicator="left"
            />
            <PremiumSubmenuItem
              id="images-section"
              label="Images"
              icon={<Image className="size-4" />}
              variant="subtle"
              indicator="left"
            />
          </PremiumNavItemWithSubmenu>
        </PremiumNavSection>

        <PremiumNavSection title="Admin">
          <PremiumNavItemWithSubmenu
            id="admin-settings"
            label="Settings"
            icon={<Settings className="size-4" />}
            animated
            variant="subtle"
            indicator="left"
          >
            <PremiumSubmenuItem
              id="users-admin"
              label="Users"
              icon={<Users className="size-4" />}
              variant="subtle"
              indicator="left"
            />
            <PremiumSubmenuItem
              id="security-admin"
              label="Security"
              icon={<Shield className="size-4" />}
              variant="subtle"
              indicator="left"
            />
          </PremiumNavItemWithSubmenu>

          <PremiumNavItem
            id="analytics"
            label="Analytics"
            icon={<BarChart3 className="size-4" />}
            variant="subtle"
            indicator="left"
          />
        </PremiumNavSection>
      </div>
    </NavigationProvider>
  ),
};

// ============================================================================
// Stories: Default Expanded
// ============================================================================

export const DefaultExpanded: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="documents">
      <div className="w-[280px] p-4 border rounded-lg space-y-1">
        <PremiumNavItemWithSubmenu
          id="files"
          label="Files"
          icon={<Folder className="size-4" />}
          animated
          defaultOpen
        >
          <PremiumSubmenuItem
            id="documents"
            label="Documents"
            icon={<FileText className="size-4" />}
          />
          <PremiumSubmenuItem
            id="images"
            label="Images"
            icon={<Image className="size-4" />}
          />
        </PremiumNavItemWithSubmenu>

        <PremiumNavItemWithSubmenu
          id="settings"
          label="Settings"
          icon={<Settings className="size-4" />}
          animated
          defaultOpen
        >
          <PremiumSubmenuItem
            id="profile"
            label="Profile"
            icon={<Users className="size-4" />}
          />
          <PremiumSubmenuItem
            id="security"
            label="Security"
            icon={<Shield className="size-4" />}
          />
        </PremiumNavItemWithSubmenu>
      </div>
    </NavigationProvider>
  ),
};

// ============================================================================
// Stories: Controlled State
// ============================================================================

export const ControlledState: Story = {
  render: () => {
    const [openSubmenu, setOpenSubmenu] = React.useState<string | null>("files");
    const [activeItem, setActiveItem] = React.useState("documents");

    return (
      <NavigationProvider activeItem={activeItem} onActiveItemChange={setActiveItem}>
        <div className="w-[280px] p-4 border rounded-lg space-y-1">
          <p className="text-xs text-muted-foreground mb-4">
            Open submenu: <strong>{openSubmenu || "none"}</strong>
            <br />
            Active item: <strong>{activeItem}</strong>
          </p>
          
          <PremiumNavItemWithSubmenu
            id="files"
            label="Files"
            icon={<Folder className="size-4" />}
            animated
            open={openSubmenu === "files"}
            onOpenChange={(open) => setOpenSubmenu(open ? "files" : null)}
          >
            <PremiumSubmenuItem
              id="documents"
              label="Documents"
              icon={<FileText className="size-4" />}
            />
            <PremiumSubmenuItem
              id="images"
              label="Images"
              icon={<Image className="size-4" />}
            />
          </PremiumNavItemWithSubmenu>

          <PremiumNavItemWithSubmenu
            id="settings"
            label="Settings"
            icon={<Settings className="size-4" />}
            animated
            open={openSubmenu === "settings"}
            onOpenChange={(open) => setOpenSubmenu(open ? "settings" : null)}
          >
            <PremiumSubmenuItem
              id="profile"
              label="Profile"
              icon={<Users className="size-4" />}
            />
            <PremiumSubmenuItem
              id="security"
              label="Security"
              icon={<Shield className="size-4" />}
            />
          </PremiumNavItemWithSubmenu>
        </div>
      </NavigationProvider>
    );
  },
};

// ============================================================================
// Stories: Size Comparison (PremiumNavItem vs PremiumSubmenuItem)
// ============================================================================

export const SizeComparison: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="sub-item-1">
      <div className="w-[320px] p-4 border rounded-lg space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">
            PremiumNavItem (44px height, standard padding)
          </p>
          <PremiumNavItem
            id="nav-item-1"
            label="Main Navigation Item"
            icon={<Folder className="size-5" />}
            variant="subtle"
          />
          <PremiumNavItem
            id="nav-item-2"
            label="Another Main Item"
            icon={<Settings className="size-5" />}
            variant="subtle"
          />
        </div>
        
        <div className="border-t pt-4 space-y-1">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">
            PremiumSubmenuItem (36px height, compact padding)
          </p>
          <div className="pl-4 border-l border-border/50 space-y-0.5">
            <PremiumSubmenuItem
              id="sub-item-1"
              label="Submenu Item One"
              icon={<FileText className="size-4" />}
              variant="subtle"
            />
            <PremiumSubmenuItem
              id="sub-item-2"
              label="Submenu Item Two"
              icon={<Image className="size-4" />}
              variant="subtle"
            />
            <PremiumSubmenuItem
              id="sub-item-3"
              label="Submenu Item Three"
              icon={<Video className="size-4" />}
              variant="subtle"
            />
          </div>
        </div>
      </div>
    </NavigationProvider>
  ),
};

// ============================================================================
// Stories: With Labels/Tags (badge support)
// ============================================================================

export const WithBadges: Story = {
  render: () => (
    <NavigationProvider defaultActiveItem="inbox">
      <div className="w-[280px] p-4 border rounded-lg space-y-1">
        <PremiumNavItemWithSubmenu
          id="mail"
          label="Mail"
          icon={<Mail className="size-4" />}
          badge={<span className="text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">5</span>}
          animated
          defaultOpen
        >
          <PremiumSubmenuItem
            id="inbox"
            label="Inbox"
            icon={<Inbox className="size-4" />}
            badge={<span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">3</span>}
          />
          <PremiumSubmenuItem
            id="starred"
            label="Starred"
            icon={<Star className="size-4" />}
            badge={<span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">2</span>}
          />
          <PremiumSubmenuItem
            id="trash"
            label="Trash"
            icon={<Trash className="size-4" />}
          />
        </PremiumNavItemWithSubmenu>
        
        <PremiumNavItemWithSubmenu
          id="tags"
          label="Tags"
          icon={<Tag className="size-4" />}
          animated
        >
          <PremiumSubmenuItem
            id="important"
            label="Important"
            badge={<span className="size-2 bg-red-500 rounded-full" />}
          />
          <PremiumSubmenuItem
            id="work"
            label="Work"
            badge={<span className="size-2 bg-blue-500 rounded-full" />}
          />
          <PremiumSubmenuItem
            id="personal"
            label="Personal"
            badge={<span className="size-2 bg-green-500 rounded-full" />}
          />
        </PremiumNavItemWithSubmenu>
      </div>
    </NavigationProvider>
  ),
};
