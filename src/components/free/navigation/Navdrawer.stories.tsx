import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Home,
  Inbox,
  Calendar,
  Settings,
  Users,
  BarChart3,
  FileText,
  Mail,
  HelpCircle,
  LogOut,
  Layers,
  Folder,
} from "lucide-react";

import {
  NavigationProvider,
  Navdrawer,
  NavdrawerContent,
  NavdrawerHeader,
  NavdrawerTitle,
  NavdrawerFooter,
  NavItem,
  NavSection,
  NavDivider,
  NavBadge,
} from "./index";
import { Button } from "../button";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

// ============================================================================
// Meta
// ============================================================================

const meta = {
  title: "Free/Navigation/Navdrawer",
  component: Navdrawer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Slide-in drawer for mobile navigation or secondary menus.

## Features
- Modal overlay with backdrop
- Left or right anchor positioning
- Multiple size options (xs, sm, md, lg, xl, full)
- Smooth slide-in animation
- Keyboard support (Escape to close)
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navdrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Sample Data
// ============================================================================

const mainNavItems = [
  { id: "home", label: "Home", icon: <Home /> },
  { id: "inbox", label: "Inbox", icon: <Inbox />, badge: "5" },
  { id: "calendar", label: "Calendar", icon: <Calendar /> },
];

const sideNavItems = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 /> },
  { id: "projects", label: "Projects", icon: <Folder /> },
  { id: "documents", label: "Documents", icon: <FileText /> },
];

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <NavigationProvider defaultActiveItem="home">
        <div className="p-8">
          <Button onClick={() => setOpen(true)}>Open Navigation Drawer</Button>
          <Navdrawer open={open} onOpenChange={setOpen}>
            <NavdrawerContent>
              <NavdrawerHeader>
                <NavdrawerTitle>Navigation</NavdrawerTitle>
              </NavdrawerHeader>
              <div className="flex-1 overflow-y-auto py-2">
                <NavSection>
                  {mainNavItems.map((item) => (
                    <NavItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      icon={item.icon}
                      badge={item.badge && <NavBadge variant="primary">{item.badge}</NavBadge>}
                    />
                  ))}
                </NavSection>
                <NavDivider />
                <NavSection title="Workspace">
                  {sideNavItems.map((item) => (
                    <NavItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      icon={item.icon}
                    />
                  ))}
                </NavSection>
                <NavDivider />
                <NavSection>
                  <NavItem id="settings" label="Settings" icon={<Settings />} />
                  <NavItem id="help" label="Help & Support" icon={<HelpCircle />} />
                </NavSection>
              </div>
              <NavdrawerFooter>
                <Avatar size="sm">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                </div>
                <Button colorStyle="ghost" iconOnly size="sm">
                  <LogOut className="size-4" />
                </Button>
              </NavdrawerFooter>
            </NavdrawerContent>
          </Navdrawer>
        </div>
      </NavigationProvider>
    );
  },
};

export const RightAnchor: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <NavigationProvider defaultActiveItem="settings">
        <div className="p-8">
          <Button onClick={() => setOpen(true)}>Open Right Drawer</Button>
          <Navdrawer open={open} onOpenChange={setOpen} anchor="right">
            <NavdrawerContent>
              <NavdrawerHeader>
                <NavdrawerTitle>Settings</NavdrawerTitle>
              </NavdrawerHeader>
              <div className="flex-1 overflow-y-auto py-2">
                <NavSection title="Account">
                  <NavItem id="profile" label="Profile" icon={<Users />} />
                  <NavItem id="security" label="Security" icon={<Settings />} />
                </NavSection>
                <NavDivider />
                <NavSection title="Preferences">
                  <NavItem id="notifications" label="Notifications" icon={<Mail />} />
                  <NavItem id="appearance" label="Appearance" icon={<Settings />} />
                </NavSection>
              </div>
            </NavdrawerContent>
          </Navdrawer>
        </div>
      </NavigationProvider>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [openSize, setOpenSize] = React.useState<string | null>(null);
    const sizes = ["xs", "sm", "md", "lg", "xl", "full"] as const;

    return (
      <NavigationProvider defaultActiveItem="home">
        <div className="p-8 space-x-2">
          {sizes.map((size) => (
            <Button key={size} onClick={() => setOpenSize(size)}>
              Open {size.toUpperCase()}
            </Button>
          ))}
          {sizes.map((size) => (
            <Navdrawer
              key={size}
              open={openSize === size}
              onOpenChange={(open) => !open && setOpenSize(null)}
              size={size}
            >
              <NavdrawerContent>
                <NavdrawerHeader>
                  <Layers className="size-5 text-primary" />
                  <NavdrawerTitle>Size: {size.toUpperCase()}</NavdrawerTitle>
                </NavdrawerHeader>
                <div className="flex-1 overflow-y-auto py-2">
                  <NavSection>
                    {mainNavItems.map((item) => (
                      <NavItem
                        key={item.id}
                        id={item.id}
                        label={item.label}
                        icon={item.icon}
                      />
                    ))}
                  </NavSection>
                </div>
              </NavdrawerContent>
            </Navdrawer>
          ))}
        </div>
      </NavigationProvider>
    );
  },
};
