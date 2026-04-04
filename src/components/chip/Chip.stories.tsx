import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Calendar,
  User,
  MapPin,
  Tag,
  Star,
  Heart,
  Clock,
  Filter,
  Plus,
  Search,
  Mail,
  Phone,
  Camera,
  Music,
  Video,
  Image,
  FileText,
  Folder,
  Settings,
  Home,
  Bookmark,
  Share2,
  Download,
  Upload,
  Edit,
  Trash2,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  Coffee,
  Pizza,
  Plane,
  Car,
  Building,
} from "lucide-react";

import { Chip, ChipGroup } from "./index";

/**
 * # Chip
 *
 * Chips help people enter information, make selections, filter content,
 * or trigger actions. Following Material Design 3 specifications.
 *
 * ## Features
 * - 4 variants: `assist`, `filter`, `input`, `suggestion`
 * - 3 sizes: `sm`, `md`, `lg`
 * - Optional leading and trailing icons
 * - Elevated option for assist and suggestion chips
 * - Selection state for filter chips with checkmark
 * - Dismissible input chips with X button
 * - Full keyboard navigation and accessibility
 *
 * ## MD3 Specifications
 * - Container height: 32dp
 * - Container shape: 8dp corner radius
 * - Icon size: 18dp
 * - Left/right padding: 16dp (without icon), 8dp (with icon)
 * - Padding between elements: 8dp
 */
const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["assist", "filter", "input", "suggestion"],
      description: "The type of chip",
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "destructive"],
      description: "Semantic color treatment for the chip",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the chip",
    },
    elevated: {
      control: "boolean",
      description: "Whether the chip has elevation (shadow)",
    },
    selected: {
      control: "boolean",
      description: "Whether the chip is selected (for filter/input chips)",
    },
    dismissible: {
      control: "boolean",
      description: "Whether the chip can be dismissed (for input chips)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the chip is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// ============================================================================
// Basic Stories
// ============================================================================

export const Default: Story = {
  args: {
    children: "Chip",
    variant: "assist",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Chip variant="assist">Assist</Chip>
      <Chip variant="filter">Filter</Chip>
      <Chip variant="input">Input</Chip>
      <Chip variant="suggestion">Suggestion</Chip>
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Chip variant="input" color="default">Default</Chip>
      <Chip variant="input" color="primary">Primary</Chip>
      <Chip variant="input" color="secondary">Secondary</Chip>
      <Chip variant="input" color="success">Success</Chip>
      <Chip variant="input" color="warning">Warning</Chip>
      <Chip variant="input" color="destructive">Destructive</Chip>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
};

// ============================================================================
// Assist Chip Stories
// ============================================================================

export const AssistChip: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-muted-foreground">Basic</h3>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="assist">Schedule</Chip>
        <Chip variant="assist">Add to cart</Chip>
        <Chip variant="assist">Share</Chip>
      </div>

      <h3 className="text-sm font-medium text-muted-foreground">With Icons</h3>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="assist" leadingIcon={<Calendar />}>
          Schedule
        </Chip>
        <Chip variant="assist" leadingIcon={<MapPin />}>
          Location
        </Chip>
        <Chip variant="assist" leadingIcon={<Share2 />}>
          Share
        </Chip>
      </div>

      <h3 className="text-sm font-medium text-muted-foreground">Elevated</h3>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="assist" elevated>
          Elevated
        </Chip>
        <Chip variant="assist" elevated leadingIcon={<Sparkles />}>
          With Icon
        </Chip>
      </div>
    </div>
  ),
};

// ============================================================================
// Filter Chip Stories
// ============================================================================

export const FilterChip: Story = {
  render: function FilterChipStory() {
    const [selected1, setSelected1] = React.useState(false);
    const [selected2, setSelected2] = React.useState(true);
    const [selected3, setSelected3] = React.useState(false);

    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Interactive Filter Chips
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <Chip
            variant="filter"
            selected={selected1}
            onSelectedChange={setSelected1}
          >
            Running
          </Chip>
          <Chip
            variant="filter"
            selected={selected2}
            onSelectedChange={setSelected2}
          >
            Outdoor
          </Chip>
          <Chip
            variant="filter"
            selected={selected3}
            onSelectedChange={setSelected3}
          >
            Shoes
          </Chip>
        </div>

        <h3 className="text-sm font-medium text-muted-foreground">
          With Leading Icons
        </h3>
        <FilterChipsWithIcons />

        <h3 className="text-sm font-medium text-muted-foreground">
          States Preview
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <Chip variant="filter">Unselected</Chip>
          <Chip variant="filter" selected>
            Selected
          </Chip>
          <Chip variant="filter" disabled>
            Disabled
          </Chip>
        </div>
      </div>
    );
  },
};

function FilterChipsWithIcons() {
  const [filters, setFilters] = React.useState({
    coffee: false,
    pizza: true,
    plane: false,
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip
        variant="filter"
        selected={filters.coffee}
        onSelectedChange={(v) => setFilters((f) => ({ ...f, coffee: v }))}
        leadingIcon={<Coffee />}
      >
        Coffee
      </Chip>
      <Chip
        variant="filter"
        selected={filters.pizza}
        onSelectedChange={(v) => setFilters((f) => ({ ...f, pizza: v }))}
        leadingIcon={<Pizza />}
      >
        Pizza
      </Chip>
      <Chip
        variant="filter"
        selected={filters.plane}
        onSelectedChange={(v) => setFilters((f) => ({ ...f, plane: v }))}
        leadingIcon={<Plane />}
      >
        Travel
      </Chip>
    </div>
  );
}

// ============================================================================
// Input Chip Stories
// ============================================================================

export const InputChip: Story = {
  render: function InputChipStory() {
    const [chips, setChips] = React.useState([
      { id: 1, label: "John Doe", avatar: "JD" },
      { id: 2, label: "Jane Smith", avatar: "JS" },
      { id: 3, label: "Bob Wilson", avatar: "BW" },
    ]);

    const handleDismiss = (id: number) => {
      setChips((prev) => prev.filter((chip) => chip.id !== id));
    };

    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Dismissible Input Chips
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <Chip
              key={chip.id}
              variant="input"
              dismissible
              onDismiss={() => handleDismiss(chip.id)}
              leadingIcon={
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {chip.avatar}
                </span>
              }
            >
              {chip.label}
            </Chip>
          ))}
        </div>

        {chips.length === 0 && (
          <p className="text-sm text-muted-foreground">
            All chips dismissed! Refresh to try again.
          </p>
        )}

        <h3 className="text-sm font-medium text-muted-foreground">
          With Icons
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <Chip variant="input" dismissible leadingIcon={<Tag />}>
            Label
          </Chip>
          <Chip variant="input" dismissible leadingIcon={<MapPin />}>
            Location
          </Chip>
          <Chip variant="input" dismissible leadingIcon={<Calendar />}>
            Event
          </Chip>
        </div>

        <h3 className="text-sm font-medium text-muted-foreground">
          Selected State
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <Chip variant="input" selected leadingIcon={<User />}>
            Selected User
          </Chip>
          <Chip variant="input" leadingIcon={<User />}>
            Regular User
          </Chip>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Suggestion Chip Stories
// ============================================================================

export const SuggestionChip: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Search Suggestions
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="suggestion">react components</Chip>
        <Chip variant="suggestion">material design</Chip>
        <Chip variant="suggestion">tailwind css</Chip>
      </div>

      <h3 className="text-sm font-medium text-muted-foreground">
        Quick Actions
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="suggestion" leadingIcon={<Sparkles />}>
          Generate ideas
        </Chip>
        <Chip variant="suggestion" leadingIcon={<Edit />}>
          Improve writing
        </Chip>
        <Chip variant="suggestion" leadingIcon={<Zap />}>
          Make shorter
        </Chip>
      </div>

      <h3 className="text-sm font-medium text-muted-foreground">Elevated</h3>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="suggestion" elevated>
          Elevated
        </Chip>
        <Chip variant="suggestion" elevated leadingIcon={<Star />}>
          Featured
        </Chip>
      </div>
    </div>
  ),
};

// ============================================================================
// Icon Variations
// ============================================================================

export const WithLeadingIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip variant="assist" leadingIcon={<Calendar />}>
        Calendar
      </Chip>
      <Chip variant="assist" leadingIcon={<Clock />}>
        Time
      </Chip>
      <Chip variant="assist" leadingIcon={<MapPin />}>
        Location
      </Chip>
      <Chip variant="assist" leadingIcon={<User />}>
        Contact
      </Chip>
    </div>
  ),
};

export const WithTrailingIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip variant="assist" trailingIcon={<ChevronDown />}>
        Dropdown
      </Chip>
      <Chip variant="assist" trailingIcon={<Star />}>
        Rating
      </Chip>
      <Chip variant="suggestion" trailingIcon={<Sparkles />}>
        AI Suggestion
      </Chip>
    </div>
  ),
};

export const WithBothIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip variant="assist" leadingIcon={<User />} trailingIcon={<ChevronDown />}>
        Select User
      </Chip>
      <Chip variant="assist" leadingIcon={<Folder />} trailingIcon={<Plus />}>
        Add Folder
      </Chip>
      <Chip variant="suggestion" leadingIcon={<Search />} trailingIcon={<Zap />}>
        Quick Search
      </Chip>
    </div>
  ),
};

// ============================================================================
// States
// ============================================================================

export const DisabledState: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Chip variant="assist" disabled>
        Assist
      </Chip>
      <Chip variant="filter" disabled>
        Filter
      </Chip>
      <Chip variant="input" disabled>
        Input
      </Chip>
      <Chip variant="suggestion" disabled>
        Suggestion
      </Chip>
    </div>
  ),
};

export const SelectedStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Filter Chips
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="filter">Unselected</Chip>
        <Chip variant="filter" selected>
          Selected
        </Chip>
        <Chip variant="filter" selected leadingIcon={<Star />}>
          Selected with Icon
        </Chip>
      </div>

      <h3 className="text-sm font-medium text-muted-foreground">
        Input Chips
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <Chip variant="input">Unselected</Chip>
        <Chip variant="input" selected>
          Selected
        </Chip>
        <Chip variant="input" selected dismissible>
          Selected Dismissible
        </Chip>
      </div>
    </div>
  ),
};

// ============================================================================
// ChipGroup Stories
// ============================================================================

export const ChipGroupBasic: Story = {
  render: () => (
    <ChipGroup>
      <Chip variant="filter">Option 1</Chip>
      <Chip variant="filter" selected>
        Option 2
      </Chip>
      <Chip variant="filter">Option 3</Chip>
      <Chip variant="filter">Option 4</Chip>
    </ChipGroup>
  ),
};

export const ChipGroupSpacing: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Small spacing</p>
        <ChipGroup spacing="sm">
          <Chip variant="assist">One</Chip>
          <Chip variant="assist">Two</Chip>
          <Chip variant="assist">Three</Chip>
        </ChipGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Medium spacing</p>
        <ChipGroup spacing="md">
          <Chip variant="assist">One</Chip>
          <Chip variant="assist">Two</Chip>
          <Chip variant="assist">Three</Chip>
        </ChipGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Large spacing</p>
        <ChipGroup spacing="lg">
          <Chip variant="assist">One</Chip>
          <Chip variant="assist">Two</Chip>
          <Chip variant="assist">Three</Chip>
        </ChipGroup>
      </div>
    </div>
  ),
};

export const ChipGroupNoWrap: Story = {
  render: () => (
    <div className="w-[300px] border rounded-lg p-4">
      <p className="mb-2 text-sm text-muted-foreground">
        Horizontal scroll (no wrap)
      </p>
      <ChipGroup wrap={false}>
        <Chip variant="suggestion">Suggestion 1</Chip>
        <Chip variant="suggestion">Suggestion 2</Chip>
        <Chip variant="suggestion">Suggestion 3</Chip>
        <Chip variant="suggestion">Suggestion 4</Chip>
        <Chip variant="suggestion">Suggestion 5</Chip>
      </ChipGroup>
    </div>
  ),
};

// ============================================================================
// Real World Examples
// ============================================================================

export const EmailRecipients: Story = {
  name: "Example: Email Recipients",
  render: function EmailRecipientsStory() {
    const [recipients, setRecipients] = React.useState([
      { id: 1, name: "Alice Johnson", email: "alice@example.com" },
      { id: 2, name: "Bob Smith", email: "bob@example.com" },
      { id: 3, name: "Carol White", email: "carol@example.com" },
    ]);

    return (
      <div className="w-[400px] rounded-lg border p-4">
        <label className="mb-2 block text-sm font-medium">To:</label>
        <ChipGroup>
          {recipients.map((recipient) => (
            <Chip
              key={recipient.id}
              variant="input"
              dismissible
              onDismiss={() =>
                setRecipients((r) => r.filter((x) => x.id !== recipient.id))
              }
              leadingIcon={<Mail className="text-muted-foreground" />}
            >
              {recipient.name}
            </Chip>
          ))}
        </ChipGroup>
      </div>
    );
  },
};

export const ProductFilters: Story = {
  name: "Example: Product Filters",
  render: function ProductFiltersStory() {
    const [filters, setFilters] = React.useState({
      inStock: true,
      onSale: false,
      freeShipping: true,
      newArrivals: false,
    });

    const toggleFilter = (key: keyof typeof filters) => {
      setFilters((f) => ({ ...f, [key]: !f[key] }));
    };

    return (
      <div className="w-[500px] rounded-lg border p-4">
        <h3 className="mb-3 font-medium">Filter Products</h3>
        <ChipGroup>
          <Chip
            variant="filter"
            selected={filters.inStock}
            onSelectedChange={() => toggleFilter("inStock")}
            leadingIcon={<Check />}
          >
            In Stock
          </Chip>
          <Chip
            variant="filter"
            selected={filters.onSale}
            onSelectedChange={() => toggleFilter("onSale")}
            leadingIcon={<Tag />}
          >
            On Sale
          </Chip>
          <Chip
            variant="filter"
            selected={filters.freeShipping}
            onSelectedChange={() => toggleFilter("freeShipping")}
            leadingIcon={<Car />}
          >
            Free Shipping
          </Chip>
          <Chip
            variant="filter"
            selected={filters.newArrivals}
            onSelectedChange={() => toggleFilter("newArrivals")}
            leadingIcon={<Sparkles />}
          >
            New Arrivals
          </Chip>
        </ChipGroup>
      </div>
    );
  },
};

export const AISuggestions: Story = {
  name: "Example: AI Suggestions",
  render: () => (
    <div className="w-[400px] rounded-lg border p-4">
      <h3 className="mb-3 font-medium">Suggested prompts</h3>
      <ChipGroup>
        <Chip variant="suggestion" leadingIcon={<Sparkles />}>
          Summarize this
        </Chip>
        <Chip variant="suggestion" leadingIcon={<Edit />}>
          Improve writing
        </Chip>
        <Chip variant="suggestion" leadingIcon={<Zap />}>
          Make it shorter
        </Chip>
        <Chip variant="suggestion" leadingIcon={<FileText />}>
          Add more detail
        </Chip>
      </ChipGroup>
    </div>
  ),
};

export const QuickActions: Story = {
  name: "Example: Quick Actions",
  render: () => (
    <div className="w-[400px] rounded-lg border p-4">
      <h3 className="mb-3 font-medium">Quick Actions</h3>
      <ChipGroup>
        <Chip variant="assist" leadingIcon={<Calendar />}>
          Schedule meeting
        </Chip>
        <Chip variant="assist" leadingIcon={<Phone />}>
          Call
        </Chip>
        <Chip variant="assist" leadingIcon={<Mail />}>
          Send email
        </Chip>
        <Chip variant="assist" leadingIcon={<MapPin />}>
          Get directions
        </Chip>
      </ChipGroup>
    </div>
  ),
};

export const CategoryTags: Story = {
  name: "Example: Category Tags",
  render: function CategoryTagsStory() {
    const [tags, setTags] = React.useState([
      { id: 1, name: "Technology", icon: <Settings /> },
      { id: 2, name: "Design", icon: <Image /> },
      { id: 3, name: "Music", icon: <Music /> },
      { id: 4, name: "Video", icon: <Video /> },
    ]);

    return (
      <div className="w-[400px] rounded-lg border p-4">
        <h3 className="mb-3 font-medium">Categories</h3>
        <ChipGroup>
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              variant="input"
              dismissible
              onDismiss={() => setTags((t) => t.filter((x) => x.id !== tag.id))}
              leadingIcon={tag.icon}
            >
              {tag.name}
            </Chip>
          ))}
        </ChipGroup>
      </div>
    );
  },
};

// ============================================================================
// All Sizes by Variant
// ============================================================================

export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["assist", "filter", "input", "suggestion"] as const).map((variant) => (
        <div key={variant}>
          <h3 className="mb-2 text-sm font-medium capitalize text-muted-foreground">
            {variant} Chip Sizes
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant={variant} size="sm" leadingIcon={<Star />}>
              Small
            </Chip>
            <Chip variant={variant} size="md" leadingIcon={<Star />}>
              Medium
            </Chip>
            <Chip variant={variant} size="lg" leadingIcon={<Star />}>
              Large
            </Chip>
          </div>
        </div>
      ))}
    </div>
  ),
};
