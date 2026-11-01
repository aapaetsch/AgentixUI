# ReplayControls

Controlled transport, progress slider, and playback-speed selector.

## Usage

Import `aapaetsch-ui-kit/globals.css` once in your application. [Installation and framework guidance](../../../docs/README.md#frameworks-and-styling).

```tsx
"use client";
import { useState } from "react";
import { ReplayControls } from "aapaetsch-ui-kit/finance";

export function Example() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  return (
    <ReplayControls
      current={current}
      min={0}
      max={100}
      playing={playing}
      speed={speed}
      onCurrentChange={setCurrent}
      onPlayingChange={setPlaying}
      onSpeedChange={setSpeed}
      onStep={direction => setCurrent(value => Math.max(0, Math.min(100, value + direction)))}
    />
  );
}
```

## Props

| Prop | Type | Default / meaning |
| --- | --- | --- |
| `current, min, max` | `number` | Required progress position and range |
| `playing` | `boolean` | Required current playback state |
| `speed` | `number` | Required selected multiplier |
| `speedOptions` | `number[]` | [0.5, 1, 2, 4] |
| `onCurrentChange` | `(value: number) => void` | Optional slider intent |
| `onPlayingChange` | `(playing: boolean) => void` | Optional play/pause intent |
| `onStep` | `(direction: -1 or 1) => void` | Optional backward/forward intent |
| `onSpeedChange` | `(speed: number) => void` | Optional speed selection intent |
| `className` | `string` | Optional root classes merged last |

Relevant root DOM attributes, including id, aria-* and data-*, are forwarded. Custom value callbacks replace native onChange where the interface omits it. Callback examples using console.log are integration placeholders; connect them to your application workflow.

## Behavior and limits

The host owns timers, data advancement, units, and bounds. Keep min ≤ current ≤ max and include speed in speedOptions. No playback occurs unless the host handles callbacks. Native range/select controls and step buttons have accessible names.

## Examples and accessibility

Run `npm run storybook` from the repository root for the colocated stories. Keep financial units and essential state in text, and supply loading/error/empty presentation in the host when needed. Interactive components require a client boundary in Next.js. See [the documentation index](../../../docs/README.md) for integration and verification commands.
