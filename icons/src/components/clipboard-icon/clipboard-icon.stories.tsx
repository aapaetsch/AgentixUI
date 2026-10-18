// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ClipboardIcon } from "./index";
const meta={title:"Icons/Files/Clipboard",component:ClipboardIcon,args:{"aria-label":"Clipboard"},tags:["autodocs"]} satisfies Meta<typeof ClipboardIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ClipboardIcon size="0.875rem" aria-label="Clipboard 0.875rem"/><ClipboardIcon size="1rem" aria-label="Clipboard 1rem"/><ClipboardIcon size="1.25rem" aria-label="Clipboard 1.25rem"/><ClipboardIcon size="1.5rem" aria-label="Clipboard 1.5rem"/></div>};
