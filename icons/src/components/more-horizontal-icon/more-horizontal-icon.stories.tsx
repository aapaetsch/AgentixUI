// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontalIcon } from "./index";
const meta={title:"Icons/Actions/More Horizontal",component:MoreHorizontalIcon,args:{"aria-label":"More Horizontal"},tags:["autodocs"]} satisfies Meta<typeof MoreHorizontalIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MoreHorizontalIcon size="0.875rem" aria-label="More Horizontal 0.875rem"/><MoreHorizontalIcon size="1rem" aria-label="More Horizontal 1rem"/><MoreHorizontalIcon size="1.25rem" aria-label="More Horizontal 1.25rem"/><MoreHorizontalIcon size="1.5rem" aria-label="More Horizontal 1.5rem"/></div>};
