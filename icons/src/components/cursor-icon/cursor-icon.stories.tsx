// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CursorIcon } from "./index";
const meta={title:"Icons/Charts/Cursor",component:CursorIcon,args:{"aria-label":"Cursor"},tags:["autodocs"]} satisfies Meta<typeof CursorIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CursorIcon size="0.875rem" aria-label="Cursor 0.875rem"/><CursorIcon size="1rem" aria-label="Cursor 1rem"/><CursorIcon size="1.25rem" aria-label="Cursor 1.25rem"/><CursorIcon size="1.5rem" aria-label="Cursor 1.5rem"/></div>};
