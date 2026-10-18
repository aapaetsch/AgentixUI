// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MoreVerticalIcon } from "./index";
const meta={title:"Icons/Actions/More Vertical",component:MoreVerticalIcon,args:{"aria-label":"More Vertical"},tags:["autodocs"]} satisfies Meta<typeof MoreVerticalIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MoreVerticalIcon size="0.875rem" aria-label="More Vertical 0.875rem"/><MoreVerticalIcon size="1rem" aria-label="More Vertical 1rem"/><MoreVerticalIcon size="1.25rem" aria-label="More Vertical 1.25rem"/><MoreVerticalIcon size="1.5rem" aria-label="More Vertical 1.5rem"/></div>};
