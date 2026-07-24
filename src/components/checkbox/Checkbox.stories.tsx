import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './index';

const meta: Meta<typeof Checkbox> = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    labelPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    checked: {
      control: 'radio',
      options: [true, false, 'indeterminate'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked checkbox',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all items',
    checked: 'indeterminate',
  },
};

export const Unchecked: Story = {
  args: {
    label: 'Unchecked checkbox',
    checked: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked checkbox',
    checked: true,
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    label: 'This field is required',
    error: true,
  },
};

export const ErrorChecked: Story = {
  args: {
    label: 'Error checked state',
    error: true,
    checked: true,
  },
};

export const LabelPositionLeft: Story = {
  args: {
    label: 'Label on the left',
    labelPosition: 'left',
  },
};

export const WithoutLabel: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox label="Small checkbox" size="sm" />
      <Checkbox label="Medium checkbox (default)" size="md" />
      <Checkbox label="Large checkbox" size="lg" />
    </div>
  ),
};

export const SizesChecked: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox label="Small checked" size="sm" defaultChecked />
      <Checkbox label="Medium checked" size="md" defaultChecked />
      <Checkbox label="Large checked" size="lg" defaultChecked />
    </div>
  ),
};

export const RippleDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8">
      <h3 className="text-sm font-medium text-muted-foreground">Click to see ripple effects</h3>
      <div className="flex gap-4 items-center">
        <Checkbox label="Standard checkbox" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" checked="indeterminate" />
        <Checkbox label="Error state" error />
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium mb-2">Standard States</h3>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" checked="indeterminate" />
      
      <h3 className="text-sm font-medium mt-4 mb-2">Disabled States</h3>
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" checked disabled />
      
      <h3 className="text-sm font-medium mt-4 mb-2">Error States</h3>
      <Checkbox label="Error unchecked" error />
      <Checkbox label="Error checked" error defaultChecked />
      
      <h3 className="text-sm font-medium mt-4 mb-2">Label Positions</h3>
      <Checkbox label="Label on right (default)" labelPosition="right" />
      <Checkbox label="Label on left" labelPosition="left" />
    </div>
  ),
};