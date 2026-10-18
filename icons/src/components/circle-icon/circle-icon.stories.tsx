// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CircleIcon } from "./index";
const meta={title:"Icons/Actions/Circle",component:CircleIcon,args:{"aria-label":"Circle"},tags:["autodocs"]} satisfies Meta<typeof CircleIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CircleIcon size="0.875rem" aria-label="Circle 0.875rem"/><CircleIcon size="1rem" aria-label="Circle 1rem"/><CircleIcon size="1.25rem" aria-label="Circle 1.25rem"/><CircleIcon size="1.5rem" aria-label="Circle 1.5rem"/></div>};
