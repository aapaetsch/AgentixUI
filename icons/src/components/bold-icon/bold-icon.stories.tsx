// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { BoldIcon } from "./index";
const meta={title:"Icons/Actions/Bold",component:BoldIcon,args:{"aria-label":"Bold"},tags:["autodocs"]} satisfies Meta<typeof BoldIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><BoldIcon size="0.875rem" aria-label="Bold 0.875rem"/><BoldIcon size="1rem" aria-label="Bold 1rem"/><BoldIcon size="1.25rem" aria-label="Bold 1.25rem"/><BoldIcon size="1.5rem" aria-label="Bold 1.5rem"/></div>};
