// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { BellIcon } from "./index";
const meta={title:"Icons/Feedback/Bell",component:BellIcon,args:{"aria-label":"Bell"},tags:["autodocs"]} satisfies Meta<typeof BellIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><BellIcon size="0.875rem" aria-label="Bell 0.875rem"/><BellIcon size="1rem" aria-label="Bell 1rem"/><BellIcon size="1.25rem" aria-label="Bell 1.25rem"/><BellIcon size="1.5rem" aria-label="Bell 1.5rem"/></div>};
