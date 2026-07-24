import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "./index";
import { Input } from "../input";
import { Button } from "../button";

const meta: Meta<typeof Field> = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Field>;

/**
 * Basic field: label + control, no error or description.
 */
export const Basic: Story = {
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="basic-email">Email</FieldLabel>
      <Input id="basic-email" type="email" placeholder="you@example.com" />
    </Field>
  ),
};

/**
 * Field with a supporting description between label and control.
 */
export const WithDescription: Story = {
  render: () => (
    <Field className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="desc-email">Email</FieldLabel>
        <FieldDescription>
          We'll only use this to send you receipts.
        </FieldDescription>
      </FieldContent>
      <Input id="desc-email" type="email" placeholder="you@example.com" />
    </Field>
  ),
};

/**
 * Field with an error message rendered via the `error` prop.
 */
export const WithError: Story = {
  render: () => (
    <Field className="max-w-sm" isInvalid>
      <FieldLabel htmlFor="err-email">Email</FieldLabel>
      <Input
        id="err-email"
        type="email"
        aria-invalid="true"
        placeholder="you@example.com"
      />
      <FieldError error="Please enter a valid email address." />
    </Field>
  ),
};

/**
 * Invalid state wired via `isInvalid` and `aria-invalid`. The `FieldError`
 * content is provided as children, demonstrating both the descriptive and
 * child-renderer patterns.
 */
export const InvalidState: Story = {
  render: () => (
    <Field className="max-w-sm" isInvalid>
      <FieldLabel htmlFor="inv-username">Username</FieldLabel>
      <Input id="inv-username" aria-invalid="true" defaultValue="ab" />
      <FieldError>
        Username must be at least 3 characters long.
      </FieldError>
    </Field>
  ),
};

/**
 * Horizontal layout — label and control on the same line via a flex wrapper.
 */
export const HorizontalLayout: Story = {
  render: () => (
    <Field className="max-w-md">
      <div className="flex items-center gap-4">
        <FieldLabel htmlFor="h-email" className="w-24 shrink-0">
          Email
        </FieldLabel>
        <Input id="h-email" type="email" placeholder="you@example.com" className="flex-1" />
      </div>
      <FieldError error="" />
    </Field>
  ),
};

/**
 * A full example form combining description + error + submit button.
 */
export const FormExample: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setSuccess("");
      if (!value.includes("@")) {
        setError("Please enter a valid email address.");
      } else {
        setError("");
        setSuccess(`Subscribed: ${value}`);
      }
    }

    return (
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <Field isInvalid={Boolean(error)}>
          <FieldContent>
            <FieldLabel htmlFor="ex-email">Email</FieldLabel>
            <FieldDescription>Get product updates, no spam.</FieldDescription>
          </FieldContent>
          <Input
            id="ex-email"
            type="email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-invalid={Boolean(error)}
            placeholder="you@example.com"
          />
          <FieldError error={error} />
          {success ? (
            <p className="text-sm text-primary">{success}</p>
          ) : null}
        </Field>
        <Button type="submit">Subscribe</Button>
      </form>
    );
  },
};