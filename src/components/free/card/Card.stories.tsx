import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Heart, MoreVertical, Share2, Bookmark, Play, Star, MapPin, Clock, User } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardMedia,
  CardActions,
  CardFooter,
  SwipeableCard,
  ExpandableCard,
} from "./index";
import { Button } from "../button";
import { IconButton } from "../button/icon-button";
import { Badge } from "../badge";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

const meta: Meta<typeof Card> = {
  title: "Free/Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Cards display content and actions about a single subject following Material Design 3 specifications. Supports elevated, filled, and outlined variants with responsive size options.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "filled", "outlined"],
      description: "Card visual style following MD3 specifications",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Controls padding and border radius",
    },
    interactive: {
      control: "boolean",
      description: "Makes the card clickable with focus and hover states",
    },
    disabled: {
      control: "boolean",
      description: "Disables the card interaction",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the main content area of the card. You can put any content here
          including text, images, lists, and other components.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-[350px]">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>Has a drop shadow for visual separation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Elevated cards provide more separation from the background than filled
          cards, but less than outlined cards.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Filled: Story = {
  render: () => (
    <Card variant="filled" className="w-[350px]">
      <CardHeader>
        <CardTitle>Filled Card</CardTitle>
        <CardDescription>Subtle background fill without border</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Filled cards provide subtle separation from the background. This has less
          emphasis than elevated or outlined cards.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-[350px]">
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
        <CardDescription>Visible border with transparent background</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Outlined cards have a visual boundary around the container. This can
          provide greater emphasis than the other types.
        </p>
      </CardContent>
    </Card>
  ),
};

// ============================================================================
// Variant Comparison
// ============================================================================

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Card variant="elevated" className="w-[280px]">
        <CardHeader>
          <CardTitle size="sm">Elevated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Drop shadow separation</p>
        </CardContent>
      </Card>
      <Card variant="filled" className="w-[280px]">
        <CardHeader>
          <CardTitle size="sm">Filled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Subtle background fill</p>
        </CardContent>
      </Card>
      <Card variant="outlined" className="w-[280px]">
        <CardHeader>
          <CardTitle size="sm">Outlined</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Visible border</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// Size Variants
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Card key={size} variant="outlined" size={size} className="w-[350px]">
          <CardHeader size={size}>
            <CardTitle size={size}>Size: {size}</CardTitle>
            <CardDescription size={size}>
              Card with {size} size variant
            </CardDescription>
          </CardHeader>
          <CardContent size={size}>
            <p className="text-muted-foreground">
              This card demonstrates the {size} size variant with appropriate
              padding and typography.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// ============================================================================
// Interactive Cards
// ============================================================================

export const Interactive: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Card
        variant="elevated"
        interactive
        className="w-[250px]"
        onClick={() => alert("Card clicked!")}
      >
        <CardHeader>
          <CardTitle size="sm">Clickable Card</CardTitle>
          <CardDescription size="sm">Click me!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Interactive cards have focus states and scale on press.
          </p>
        </CardContent>
      </Card>

      <Card variant="outlined" interactive className="w-[250px]">
        <CardHeader>
          <CardTitle size="sm">Focus Me</CardTitle>
          <CardDescription size="sm">Try keyboard navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tab to focus, Enter to activate.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// Card with Media
// ============================================================================

export const WithMedia: Story = {
  name: "With Media",
  render: () => (
    <Card variant="elevated" className="w-[350px]">
      <CardMedia
        src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop"
        alt="Tokyo cityscape"
        aspectRatio="video"
      />
      <CardHeader>
        <CardTitle>Tokyo, Japan</CardTitle>
        <CardDescription>Explore the vibrant city</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Experience the perfect blend of ancient traditions and cutting-edge
          technology in one of the world&apos;s most fascinating cities.
        </p>
      </CardContent>
      <CardActions>
        <Button colorStyle="text" size="sm">
          Learn More
        </Button>
        <Button size="sm">Book Now</Button>
      </CardActions>
    </Card>
  ),
};

export const MediaAspectRatios: Story = {
  name: "Media Aspect Ratios",
  render: () => (
    <div className="flex gap-4 flex-wrap">
      {(["square", "video", "wide", "tall"] as const).map((ratio) => (
        <Card key={ratio} variant="outlined" className="w-[200px]">
          <CardMedia
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
            alt="Mountain landscape"
            aspectRatio={ratio}
          />
          <CardContent standalone className="pt-3">
            <p className="text-sm font-medium">{ratio}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// ============================================================================
// Card with Header Extras
// ============================================================================

export const WithAvatar: Story = {
  name: "With Avatar",
  render: () => (
    <Card variant="elevated" className="w-[350px]">
      <CardHeader
        leading={
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?u=john" alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        }
        trailing={
          <IconButton
            colorStyle="standard"
            size="sm"
            aria-label="More options"
          >
            <MoreVertical />
          </IconButton>
        }
      >
        <CardTitle size="sm">John Doe</CardTitle>
        <CardDescription size="sm">Posted 2 hours ago</CardDescription>
      </CardHeader>
      <CardMedia
        src="https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=400&fit=crop"
        alt="Sunset over mountains"
        aspectRatio="video"
      />
      <CardActions align="between">
        <div className="flex gap-1">
          <IconButton colorStyle="standard" size="sm" aria-label="Like">
            <Heart />
          </IconButton>
          <IconButton colorStyle="standard" size="sm" aria-label="Share">
            <Share2 />
          </IconButton>
        </div>
        <IconButton colorStyle="standard" size="sm" aria-label="Save">
          <Bookmark />
        </IconButton>
      </CardActions>
    </Card>
  ),
};

// ============================================================================
// Card with Footer
// ============================================================================

export const WithFooter: Story = {
  name: "With Footer",
  render: () => (
    <Card variant="outlined" className="w-[350px]">
      <CardHeader>
        <CardTitle>Premium Subscription</CardTitle>
        <CardDescription>Unlock all features</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Star className="size-4 text-amber-500" />
            Unlimited access to all content
          </li>
          <li className="flex items-center gap-2">
            <Star className="size-4 text-amber-500" />
            Priority customer support
          </li>
          <li className="flex items-center gap-2">
            <Star className="size-4 text-amber-500" />
            Exclusive member events
          </li>
        </ul>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-2xl font-bold">$9.99</span>
        <Button>Subscribe</Button>
      </CardFooter>
    </Card>
  ),
};

// ============================================================================
// Card Compositions
// ============================================================================

export const ProductCard: Story = {
  name: "Product Card",
  render: () => (
    <Card variant="outlined" className="w-[280px]">
      <div className="relative">
        <CardMedia
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
          alt="Watch"
          aspectRatio="square"
        />
        <Badge variant="destructive" className="absolute top-2 right-2">
          -20%
        </Badge>
      </div>
      <CardHeader size="sm">
        <CardTitle size="sm">Premium Watch</CardTitle>
        <CardDescription size="sm">Elegant timepiece</CardDescription>
      </CardHeader>
      <CardContent size="sm">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">$199.99</span>
          <span className="text-sm text-muted-foreground line-through">
            $249.99
          </span>
        </div>
      </CardContent>
      <CardActions size="sm">
        <Button className="w-full">Add to Cart</Button>
      </CardActions>
    </Card>
  ),
};

export const ArticleCard: Story = {
  name: "Article Card",
  render: () => (
    <Card variant="elevated" interactive className="w-[400px]">
      <CardMedia
        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=300&fit=crop"
        alt="Office workspace"
        aspectRatio="wide"
      />
      <CardHeader>
        <div className="flex gap-2 mb-2">
          <Badge variant="secondary">Technology</Badge>
          <Badge variant="outline">5 min read</Badge>
        </div>
        <CardTitle>The Future of Remote Work</CardTitle>
        <CardDescription>
          How companies are adapting to the new normal of distributed teams
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src="https://i.pravatar.cc/150?u=author" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <span>Jane Smith</span>
        </div>
        <span>Nov 28, 2025</span>
      </CardFooter>
    </Card>
  ),
};

export const EventCard: Story = {
  name: "Event Card",
  render: () => (
    <Card variant="filled" className="w-[350px]">
      <CardMedia
        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"
        alt="Conference"
        aspectRatio="video"
      />
      <CardHeader>
        <Badge variant="success" className="w-fit mb-2">
          Upcoming
        </Badge>
        <CardTitle>Tech Conference 2025</CardTitle>
        <CardDescription>Annual developer meetup</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span>Dec 15, 2025 • 9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span>250 attendees</span>
          </div>
        </div>
      </CardContent>
      <CardActions>
        <Button colorStyle="text" size="sm">
          Learn More
        </Button>
        <Button size="sm">Register</Button>
      </CardActions>
    </Card>
  ),
};

export const VideoCard: Story = {
  name: "Video Card",
  render: () => (
    <Card variant="elevated" interactive className="w-[320px]">
      <div className="relative">
        <CardMedia
          src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=340&fit=crop"
          alt="Video thumbnail"
          aspectRatio="video"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-14 rounded-full bg-black/50 flex items-center justify-center">
            <Play className="size-6 text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs">
          12:34
        </div>
      </div>
      <CardHeader size="sm">
        <CardTitle size="sm" className="line-clamp-2">
          Building a Design System from Scratch
        </CardTitle>
        <CardDescription size="sm">Design Engineering</CardDescription>
      </CardHeader>
      <CardFooter size="sm" className="justify-between text-xs text-muted-foreground border-0 pt-0">
        <span>125K views</span>
        <span>2 days ago</span>
      </CardFooter>
    </Card>
  ),
};

// ============================================================================
// Swipeable Card
// ============================================================================

export const Swipeable: Story = {
  render: () => {
    const [cards, setCards] = React.useState([
      { id: 1, title: "Swipe me left or right", desc: "Card 1" },
      { id: 2, title: "I can be dismissed", desc: "Card 2" },
      { id: 3, title: "Try swiping!", desc: "Card 3" },
    ]);

    const handleDismiss = (id: number, direction: "left" | "right") => {
      console.log(`Card ${id} dismissed to ${direction}`);
      setCards((prev) => prev.filter((c) => c.id !== id));
    };

    return (
      <div className="flex flex-col gap-4 w-[350px]">
        <p className="text-sm text-muted-foreground text-center">
          Swipe cards left or right to dismiss
        </p>
        {cards.map((card) => (
          <SwipeableCard
            key={card.id}
            variant="outlined"
            onDismiss={(dir) => handleDismiss(card.id, dir)}
          >
            <CardHeader>
              <CardTitle size="sm">{card.title}</CardTitle>
              <CardDescription size="sm">{card.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Drag horizontally to dismiss this card.
              </p>
            </CardContent>
          </SwipeableCard>
        ))}
        {cards.length === 0 && (
          <Card variant="filled" className="text-center">
            <CardContent standalone>
              <p className="text-muted-foreground">All cards dismissed!</p>
              <Button
                colorStyle="text"
                size="sm"
                className="mt-2"
                onClick={() =>
                  setCards([
                    { id: 1, title: "Swipe me left or right", desc: "Card 1" },
                    { id: 2, title: "I can be dismissed", desc: "Card 2" },
                    { id: 3, title: "Try swiping!", desc: "Card 3" },
                  ])
                }
              >
                Reset
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
};

// ============================================================================
// Expandable Card
// ============================================================================

export const Expandable: Story = {
  render: () => {
    const [expanded, setExpanded] = React.useState(false);

    return (
      <ExpandableCard
        variant="elevated"
        className="w-[350px]"
        expanded={expanded}
        onExpandedChange={setExpanded}
        expandedContent={
          <div className="p-6 max-w-2xl mx-auto">
            <Button
              colorStyle="ghost"
              size="sm"
              className="mb-4"
              onClick={() => setExpanded(false)}
            >
              ← Back
            </Button>
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
              alt="Mountain landscape"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">Expanded View</h1>
            <p className="text-muted-foreground mb-4">
              This is the expanded content that appears when the card is clicked.
              You can put detailed information, forms, or any other content here.
            </p>
            <p className="text-muted-foreground">
              Click anywhere or the back button to close this expanded view.
              This follows the MD3 container transform transition pattern.
            </p>
          </div>
        }
      >
        <CardMedia
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
          alt="Mountain landscape"
          aspectRatio="video"
        />
        <CardHeader>
          <CardTitle>Click to Expand</CardTitle>
          <CardDescription>
            This card expands to reveal more content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            MD3 container transform: Cards can expand to fill the screen using a
            parent-child transition.
          </p>
        </CardContent>
      </ExpandableCard>
    );
  },
};

// ============================================================================
// Card Grid Layout (TODO: Use CardGrid component when available)
// ============================================================================

export const GridLayout: Story = {
  name: "Grid Layout (Preview)",
  parameters: {
    docs: {
      description: {
        story:
          "Preview of cards in a grid layout. A dedicated CardGrid component is planned for future implementation.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} variant="outlined" interactive>
          <CardMedia
            src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=400&h=300&fit=crop`}
            alt={`Image ${i}`}
            aspectRatio="video"
          />
          <CardHeader size="sm">
            <CardTitle size="sm">Card {i}</CardTitle>
            <CardDescription size="sm">Grid item example</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
};

// ============================================================================
// Card List Layout (TODO: Use CardList component when available)
// ============================================================================

export const ListLayout: Story = {
  name: "List Layout (Preview)",
  parameters: {
    docs: {
      description: {
        story:
          "Preview of cards in a vertical list layout. A dedicated CardList component is planned for future implementation.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      {[1, 2, 3].map((i) => (
        <Card key={i} variant="elevated" interactive className="flex-row">
          <CardMedia
            src={`https://images.unsplash.com/photo-${1600000000000 + i * 100000}?w=200&h=200&fit=crop`}
            alt={`Image ${i}`}
            aspectRatio="square"
            className="w-24 h-24 shrink-0"
          />
          <div className="flex-1">
            <CardHeader size="sm">
              <CardTitle size="sm">List Item {i}</CardTitle>
              <CardDescription size="sm">Horizontal card layout</CardDescription>
            </CardHeader>
          </div>
        </Card>
      ))}
    </div>
  ),
};

// ============================================================================
// Disabled State
// ============================================================================

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card variant="elevated" disabled className="w-[250px]">
        <CardHeader>
          <CardTitle size="sm">Disabled Elevated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This card is disabled</p>
        </CardContent>
      </Card>
      <Card variant="outlined" disabled className="w-[250px]">
        <CardHeader>
          <CardTitle size="sm">Disabled Outlined</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This card is disabled</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================================================
// Content Only (No Header)
// ============================================================================

export const ContentOnly: Story = {
  name: "Content Only",
  render: () => (
    <Card variant="filled" className="w-[300px]">
      <CardContent standalone>
        <p className="text-sm text-muted-foreground">
          This card has only content with standalone padding (no header above it).
          Use the <code>standalone</code> prop on CardContent when there&apos;s no
          CardHeader.
        </p>
      </CardContent>
    </Card>
  ),
};
