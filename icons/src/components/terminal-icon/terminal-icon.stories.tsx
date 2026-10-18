// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { TerminalIcon } from "./index";
const meta={title:"Icons/Actions/Terminal",component:TerminalIcon,args:{"aria-label":"Terminal"},tags:["autodocs"]} satisfies Meta<typeof TerminalIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><TerminalIcon size="0.875rem" aria-label="Terminal 0.875rem"/><TerminalIcon size="1rem" aria-label="Terminal 1rem"/><TerminalIcon size="1.25rem" aria-label="Terminal 1.25rem"/><TerminalIcon size="1.5rem" aria-label="Terminal 1.5rem"/></div>};
