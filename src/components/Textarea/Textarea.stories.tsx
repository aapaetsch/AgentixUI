import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Textarea, TextareaWithCounter } from './index';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    error: {
      control: 'boolean',
    },
    warning: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    autoResize: {
      control: 'boolean',
    },
    labelPosition: {
      control: 'radio',
      options: ['top', 'left'],
    },
    required: {
      control: 'boolean',
    },
    rows: {
      control: 'number',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

// ============================================================================
// Basic Textarea Stories
// ============================================================================

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description...',
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const WithLabelRequired: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    required: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const LabelPositionLeft: Story = {
  args: {
    label: 'Notes',
    labelPosition: 'left',
    placeholder: 'Enter notes...',
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const Error: Story = {
  args: {
    label: 'Message',
    placeholder: 'Enter your message...',
    error: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const Warning: Story = {
  args: {
    label: 'Note',
    placeholder: 'Enter a note...',
    warning: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// Size Variants
// ============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <Textarea label="Small" size="sm" placeholder="Small textarea..." />
      <Textarea label="Medium (default)" size="md" placeholder="Medium textarea..." />
      <Textarea label="Large" size="lg" placeholder="Large textarea..." />
    </div>
  ),
};

// ============================================================================
// Auto-Resize Stories
// ============================================================================

export const AutoResize: Story = {
  args: {
    label: 'Auto-Resize',
    placeholder: 'Start typing and watch me grow...',
    autoResize: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const AutoResizeWithBounds: Story = {
  args: {
    label: 'Auto-Resize with Bounds',
    placeholder: 'Min 3 rows, max 8 rows...',
    autoResize: true,
    minRows: 3,
    maxRows: 8,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const AutoResizeDemo: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <div className="w-[400px] space-y-4">
        <Textarea
          label="Type to see auto-resize"
          placeholder="Start typing to see the textarea grow..."
          autoResize
          minRows={2}
          maxRows={10}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Character count: {value.length}
        </p>
      </div>
    );
  },
};

// ============================================================================
// TextareaWithCounter Stories
// ============================================================================

type CounterStory = StoryObj<typeof TextareaWithCounter>;

export const WithCounter: CounterStory = {
  render: () => (
    <div className="w-[400px]">
      <TextareaWithCounter
        label="Message"
        placeholder="Enter your message..."
        maxLength={200}
      />
    </div>
  ),
};

export const WithCounterLeftPosition: CounterStory = {
  render: () => (
    <div className="w-[400px]">
      <TextareaWithCounter
        label="Comment"
        placeholder="Leave a comment..."
        maxLength={500}
        countPosition="bottom-left"
      />
    </div>
  ),
};

export const CounterWithWarning: CounterStory = {
  render: () => {
    const [value, setValue] = React.useState('This is some initial text that is getting close to the character limit. Keep typing to see the warning!');
    return (
      <div className="w-[400px] space-y-2">
        <TextareaWithCounter
          label="Bio"
          placeholder="Tell us about yourself..."
          maxLength={150}
          warningAt={120}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Warning appears at 120 characters, error at 150+
        </p>
      </div>
    );
  },
};

export const CounterExceeded: CounterStory = {
  render: () => {
    const [value, setValue] = React.useState(
      'This text exceeds the maximum character limit. Notice the error border around the textarea indicating that the content is too long and needs to be shortened.'
    );
    return (
      <div className="w-[400px]">
        <TextareaWithCounter
          label="Short Description"
          placeholder="Enter a brief description..."
          maxLength={100}
          warningAt={80}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const CounterWithAutoResize: CounterStory = {
  render: () => (
    <div className="w-[400px]">
      <TextareaWithCounter
        label="Feedback"
        placeholder="Share your feedback..."
        maxLength={500}
        warningAt={400}
        autoResize
        minRows={3}
        maxRows={10}
      />
    </div>
  ),
};

export const CounterRequired: CounterStory = {
  render: () => (
    <div className="w-[400px]">
      <TextareaWithCounter
        label="Review"
        placeholder="Write your review..."
        maxLength={300}
        warningAt={250}
        required
      />
    </div>
  ),
};

// ============================================================================
// All States Overview
// ============================================================================

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[450px]">
      <h3 className="text-sm font-medium">Standard States</h3>
      <Textarea label="Default" placeholder="Default textarea..." />
      <Textarea label="Disabled" placeholder="Disabled textarea..." disabled />
      
      <h3 className="text-sm font-medium mt-4">Validation States</h3>
      <Textarea label="Warning" placeholder="Warning state..." warning />
      <Textarea label="Error" placeholder="Error state..." error />
      
      <h3 className="text-sm font-medium mt-4">Label Variations</h3>
      <Textarea label="With Required" placeholder="Required field..." required />
      <Textarea label="Label Left" labelPosition="left" placeholder="Label on left..." />
      
      <h3 className="text-sm font-medium mt-4">Auto-Resize</h3>
      <Textarea
        label="Auto-Resize"
        placeholder="Type to grow..."
        autoResize
        minRows={2}
        maxRows={6}
      />
      
      <h3 className="text-sm font-medium mt-4">With Counter</h3>
      <TextareaWithCounter
        label="Character Limit"
        placeholder="Limited to 100 characters..."
        maxLength={100}
        warningAt={80}
      />
    </div>
  ),
};
