// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ListIcon } from "./index";
const meta={title:"Icons/Layout/List",component:ListIcon,args:{"aria-label":"List"},tags:["autodocs"]} satisfies Meta<typeof ListIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ListIcon size="0.875rem" aria-label="List 0.875rem"/><ListIcon size="1rem" aria-label="List 1rem"/><ListIcon size="1.25rem" aria-label="List 1.25rem"/><ListIcon size="1.5rem" aria-label="List 1.5rem"/></div>};
