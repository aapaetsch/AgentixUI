// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { GroupIcon } from "./index";
const meta={title:"Icons/Actions/Group",component:GroupIcon,args:{"aria-label":"Group"},tags:["autodocs"]} satisfies Meta<typeof GroupIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><GroupIcon size="0.875rem" aria-label="Group 0.875rem"/><GroupIcon size="1rem" aria-label="Group 1rem"/><GroupIcon size="1.25rem" aria-label="Group 1.25rem"/><GroupIcon size="1.5rem" aria-label="Group 1.5rem"/></div>};
