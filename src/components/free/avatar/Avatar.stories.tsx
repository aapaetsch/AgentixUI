import type { Meta, StoryObj } from "@storybook/react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarBadge,
  AnimatedAvatar,
} from "./index";
import { useState } from "react";
import { User, Building2, Bot } from "lucide-react";

const meta: Meta<typeof Avatar> = {
  title: "Free/Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// Sample avatar images
const avatarImages = [
  "https://github.com/shadcn.png",
  "https://github.com/maxleiter.png",
  "https://github.com/evilrabbit.png",
  "https://github.com/leerob.png",
  "https://github.com/rauchg.png",
];

// ============================================================================
// Basic Avatar Stories
// ============================================================================

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={avatarImages[0]} alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="/invalid-image.png" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <User className="size-5" />
        </AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Fallback is displayed when the image fails to load or no image is provided. Can contain initials or an icon.",
      },
    },
  },
};

// ============================================================================
// Size Variants
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="xs">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>XS</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">xs (24px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">sm (32px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="md">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">md (40px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">lg (56px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="xl">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>XL</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">xl (64px)</span>
      </div>
    </div>
  ),
};

export const SizesWithFallback: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar size="xs">
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Font sizes automatically scale with avatar size for proper proportions.",
      },
    },
  },
};

// ============================================================================
// Shape Variants
// ============================================================================

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="circle" size="lg">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" size="lg">
          <AvatarImage src={avatarImages[1]} alt="Company" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">square</span>
      </div>
    </div>
  ),
};

export const SquareShapeSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" size="xs">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>XS</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">xs</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" size="sm">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" size="md">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" size="lg">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" size="xl">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>XL</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">xl</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Square avatars have rounded corners that scale with size for visual consistency.",
      },
    },
  },
};

// ============================================================================
// Avatar Group Stories
// ============================================================================

export const BasicGroup: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src={avatarImages[0]} alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src={avatarImages[1]} alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src={avatarImages[2]} alt="User 3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const GroupWithMax: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">max=3 (5 avatars)</span>
        <AvatarGroup max={3}>
          {avatarImages.map((src, i) => (
            <Avatar key={i}>
              <AvatarImage src={src} alt={`User ${i + 1}`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">max=2 (5 avatars)</span>
        <AvatarGroup max={2}>
          {avatarImages.map((src, i) => (
            <Avatar key={i}>
              <AvatarImage src={src} alt={`User ${i + 1}`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Use the max prop to limit visible avatars and show an overflow indicator.",
      },
    },
  },
};

export const GroupSpacing: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">tight</span>
        <AvatarGroup spacing="tight">
          {avatarImages.slice(0, 3).map((src, i) => (
            <Avatar key={i}>
              <AvatarImage src={src} alt={`User ${i + 1}`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">normal (default)</span>
        <AvatarGroup spacing="normal">
          {avatarImages.slice(0, 3).map((src, i) => (
            <Avatar key={i}>
              <AvatarImage src={src} alt={`User ${i + 1}`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">loose</span>
        <AvatarGroup spacing="loose">
          {avatarImages.slice(0, 3).map((src, i) => (
            <Avatar key={i}>
              <AvatarImage src={src} alt={`User ${i + 1}`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">none (no overlap)</span>
        <AvatarGroup spacing="none">
          {avatarImages.slice(0, 3).map((src, i) => (
            <Avatar key={i}>
              <AvatarImage src={src} alt={`User ${i + 1}`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  ),
};

export const GroupOrientation: Story = {
  render: () => (
    <div className="flex gap-12">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">horizontal</span>
        <AvatarGroup orientation="horizontal">
          {avatarImages.slice(0, 3).map((src, i) => (
            <Avatar key={i}>
              <AvatarImage src={src} alt={`User ${i + 1}`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">vertical</span>
        <AvatarGroup orientation="vertical">
          {avatarImages.slice(0, 3).map((src, i) => (
            <Avatar key={i}>
              <AvatarImage src={src} alt={`User ${i + 1}`} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  ),
};

export const GroupRingWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {([1, 2, 3, 4] as const).map((width) => (
        <div key={width} className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">ringWidth={width}</span>
          <AvatarGroup ringWidth={width}>
            {avatarImages.slice(0, 3).map((src, i) => (
              <Avatar key={i}>
                <AvatarImage src={src} alt={`User ${i + 1}`} />
                <AvatarFallback>U{i + 1}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Customize the ring width around each avatar in the group for visual separation.",
      },
    },
  },
};

export const GroupSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">size={size}</span>
          <AvatarGroup size={size} max={3}>
            {avatarImages.map((src, i) => (
              <Avatar key={i} size={size}>
                <AvatarImage src={src} alt={`User ${i + 1}`} />
                <AvatarFallback>U{i + 1}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Pass size to AvatarGroup to ensure the overflow indicator matches the avatar size.",
      },
    },
  },
};

// ============================================================================
// Avatar Badge Stories
// ============================================================================

export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Avatar size="lg">
        <AvatarImage src={avatarImages[0]} alt="User" />
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge status="online" size="lg" />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={avatarImages[1]} alt="User" />
        <AvatarFallback>AB</AvatarFallback>
        <AvatarBadge status="offline" size="lg" />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={avatarImages[2]} alt="User" />
        <AvatarFallback>CD</AvatarFallback>
        <AvatarBadge status="busy" size="lg" />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={avatarImages[3]} alt="User" />
        <AvatarFallback>EF</AvatarFallback>
        <AvatarBadge status="away" size="lg" />
      </Avatar>
    </div>
  ),
};

export const BadgePositions: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>TR</AvatarFallback>
          <AvatarBadge status="online" size="lg" position="top-right" />
        </Avatar>
        <span className="text-xs text-muted-foreground">top-right</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>TL</AvatarFallback>
          <AvatarBadge status="online" size="lg" position="top-left" />
        </Avatar>
        <span className="text-xs text-muted-foreground">top-left</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>BR</AvatarFallback>
          <AvatarBadge status="online" size="lg" position="bottom-right" />
        </Avatar>
        <span className="text-xs text-muted-foreground">bottom-right</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>BL</AvatarFallback>
          <AvatarBadge status="online" size="lg" position="bottom-left" />
        </Avatar>
        <span className="text-xs text-muted-foreground">bottom-left</span>
      </div>
    </div>
  ),
};

export const BadgeSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size}>
            <AvatarImage src={avatarImages[0]} alt="User" />
            <AvatarFallback>U</AvatarFallback>
            <AvatarBadge status="online" size={size} />
          </Avatar>
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Badge size should match avatar size for proper proportions.",
      },
    },
  },
};

export const PulsingBadge: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Avatar size="lg">
        <AvatarImage src={avatarImages[0]} alt="User" />
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge status="online" size="lg" pulse />
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={avatarImages[1]} alt="User" />
        <AvatarFallback>AB</AvatarFallback>
        <AvatarBadge status="busy" size="lg" pulse />
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Use the pulse prop to add a pulsing animation for active status indicators.",
      },
    },
  },
};

// ============================================================================
// Animation Stories
// ============================================================================

export const AnimatedAvatarDemo: Story = {
  render: function AnimatedAvatarStory() {
    const [visible, setVisible] = useState(true);

    return (
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => setVisible(!visible)}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Toggle Avatar ({visible ? "visible" : "hidden"})
        </button>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <AnimatedAvatar visible={visible} animation="scale" size="lg">
              <AvatarImage src={avatarImages[0]} alt="User" />
              <AvatarFallback>SC</AvatarFallback>
            </AnimatedAvatar>
            <span className="text-xs text-muted-foreground">scale</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AnimatedAvatar visible={visible} animation="fade" size="lg">
              <AvatarImage src={avatarImages[1]} alt="User" />
              <AvatarFallback>FD</AvatarFallback>
            </AnimatedAvatar>
            <span className="text-xs text-muted-foreground">fade</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AnimatedAvatar visible={visible} animation="slide" size="lg">
              <AvatarImage src={avatarImages[2]} alt="User" />
              <AvatarFallback>SL</AvatarFallback>
            </AnimatedAvatar>
            <span className="text-xs text-muted-foreground">slide</span>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "AnimatedAvatar provides entrance/exit animations following MD3 motion guidelines.",
      },
    },
  },
};

export const BadgeAnimation: Story = {
  render: function BadgeAnimationStory() {
    const [online, setOnline] = useState(true);

    return (
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => setOnline(!online)}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Toggle Status ({online ? "online" : "offline"})
        </button>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Avatar size="lg">
              <AvatarImage src={avatarImages[0]} alt="User" />
              <AvatarFallback>JD</AvatarFallback>
              <AvatarBadge
                status={online ? "online" : "offline"}
                size="lg"
                visible={online}
                animation="scale"
              />
            </Avatar>
            <span className="text-xs text-muted-foreground">scale</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar size="lg">
              <AvatarImage src={avatarImages[1]} alt="User" />
              <AvatarFallback>AB</AvatarFallback>
              <AvatarBadge
                status={online ? "online" : "offline"}
                size="lg"
                visible={online}
                animation="fade"
              />
            </Avatar>
            <span className="text-xs text-muted-foreground">fade</span>
          </div>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Use Case Stories
// ============================================================================

export const UserProfile: Story = {
  render: () => (
    <div className="flex items-center gap-4 rounded-xl border bg-background p-4">
      <Avatar size="lg">
        <AvatarImage src={avatarImages[0]} alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge status="online" size="lg" />
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">John Doe</span>
        <span className="text-sm text-muted-foreground">Product Designer</span>
      </div>
    </div>
  ),
};

export const TeamMembers: Story = {
  render: () => (
    <div className="flex flex-col gap-4 rounded-xl border bg-background p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">Team Members</span>
        <span className="text-sm text-muted-foreground">5 members</span>
      </div>
      <AvatarGroup max={4} size="md">
        {avatarImages.map((src, i) => (
          <Avatar key={i} size="md">
            <AvatarImage src={src} alt={`Team member ${i + 1}`} />
            <AvatarFallback>T{i + 1}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  ),
};

export const CommentThread: Story = {
  render: () => (
    <div className="flex flex-col gap-4 rounded-xl border bg-background p-4">
      <div className="flex gap-3">
        <Avatar size="sm">
          <AvatarImage src={avatarImages[0]} alt="Alice" />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Alice</span>
          <p className="text-sm text-muted-foreground">
            Great work on this feature!
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Avatar size="sm">
          <AvatarImage src={avatarImages[1]} alt="Bob" />
          <AvatarFallback>BO</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Bob</span>
          <p className="text-sm text-muted-foreground">Thanks! Happy to help.</p>
        </div>
      </div>
    </div>
  ),
};

export const EntityTypes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="circle" size="lg">
          <AvatarImage src={avatarImages[0]} alt="User" />
          <AvatarFallback>
            <User className="size-6" />
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">User</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" size="lg">
          <AvatarFallback className="bg-blue-100 text-blue-600">
            <Building2 className="size-6" />
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Company</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar shape="square" size="lg">
          <AvatarFallback className="bg-purple-100 text-purple-600">
            <Bot className="size-6" />
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Bot</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use circle shape for users and square shape for organizations, teams, or bots to differentiate entity types.",
      },
    },
  },
};

export const OnlineUsers: Story = {
  render: () => (
    <div className="flex flex-col gap-3 rounded-xl border bg-background p-4">
      <span className="text-sm font-medium text-muted-foreground">Online Now</span>
      <div className="flex flex-col gap-2">
        {[
          { name: "Alice", status: "online" as const },
          { name: "Bob", status: "away" as const },
          { name: "Carol", status: "busy" as const },
          { name: "Dave", status: "offline" as const },
        ].map((user, i) => (
          <div key={i} className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarImage src={avatarImages[i]} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              <AvatarBadge status={user.status} size="sm" />
            </Avatar>
            <span className="text-sm">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
