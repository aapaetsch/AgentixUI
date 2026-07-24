import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  CommandPalette,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandEmpty,
  CommandLoading,
  useCommandPalette,
} from "./index";
import { Badge } from "../badge";

const meta: Meta<typeof CommandPalette> = {
  title: "Components/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  argTypes: {
    shortcut: { control: "text" },
    placeholder: { control: "text" },
    emptyMessage: { control: "text" },
    loop: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-64 p-8">{children}</div>
);

export const BasicList: Story = {
  render: () => (
    <Container>
      <CommandPalette open shortcut="cmd+k">
        <CommandGroup heading="Symbols">
          <CommandItem value="AAPL" label="Apple Inc." onSelect={(v) => console.log(v)} />
          <CommandItem value="MSFT" label="Microsoft Corp." />
          <CommandItem value="GOOGL" label="Alphabet Inc." />
        </CommandGroup>
      </CommandPalette>
    </Container>
  ),
};

export const Grouped: Story = {
  name: "Grouped (symbols / actions / recent)",
  render: () => (
    <Container>
      <CommandPalette open>
        <CommandGroup heading="Symbols">
          <CommandItem value="AAPL" label="Apple Inc." metadata={<Badge variant="secondary">NASDAQ</Badge>} />
          <CommandItem value="MSFT" label="Microsoft Corp." />
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="place-order" label="Place order" shortcut="⌘P" />
          <CommandItem value="switch-account" label="Switch account" />
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent">
          <CommandItem value="recent:aapl" label="AAPL" />
        </CommandGroup>
      </CommandPalette>
    </Container>
  ),
};

export const AsyncSearch: Story = {
  name: "Async Search with Loading",
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [items, setItems] = React.useState<{ value: string; label: string }[]>([]);

    React.useEffect(() => {
      if (!open) return;
      setLoading(true);
      const id = window.setTimeout(() => {
        setItems([
          { value: "AAPL", label: "Apple Inc." },
          { value: "MSFT", label: "Microsoft Corp." },
          { value: "GOOGL", label: "Alphabet Inc." },
        ]);
        setLoading(false);
      }, 600);
      return () => window.clearTimeout(id);
    }, [open]);

    return (
      <Container>
        <CommandPalette open={open} onOpenChange={setOpen} filter={false}>
          <CommandGroup heading="Symbols">
            {items.map((it) => (
              <CommandItem key={it.value} value={it.value} label={it.label} />
            ))}
          </CommandGroup>
          {loading ? <CommandLoading>Searching…</CommandLoading> : null}
          {!loading && items.length === 0 ? <CommandEmpty>No matches</CommandEmpty> : null}
        </CommandPalette>
      </Container>
    );
  },
};

export const ProgrammaticOpen: Story = {
  name: "Programmatic Open via Hook",
  render: () => (
    <Container>
      <CommandPalette>
        <CommandGroup heading="Symbols">
          <CommandItem value="AAPL" label="Apple Inc." />
        </CommandGroup>
      </CommandPalette>
      <ProgrammaticButton />
    </Container>
  ),
};

function ProgrammaticButton() {
  const { setOpen } = useCommandPalette();
  return (
    <button
      className="rounded-md border px-3 py-1 text-sm hover:bg-accent"
      onClick={() => setOpen(true)}
    >
      Open palette
    </button>
  );
}

export const EmptyState: Story = {
  name: "Empty State",
  render: () => (
    <Container>
      <CommandPalette open emptyMessage="No matches for your search.">
        <CommandGroup heading="Symbols">
          <CommandItem value="nothing" label="Nothing" forceMount />
        </CommandGroup>
        <CommandEmpty>No matches for your search.</CommandEmpty>
      </CommandPalette>
    </Container>
  ),
};