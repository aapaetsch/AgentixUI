// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ClockIcon } from "./index";
const meta={title:"Icons/Feedback/Clock",component:ClockIcon,args:{"aria-label":"Clock"},tags:["autodocs"]} satisfies Meta<typeof ClockIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ClockIcon size="0.875rem" aria-label="Clock 0.875rem"/><ClockIcon size="1rem" aria-label="Clock 1rem"/><ClockIcon size="1.25rem" aria-label="Clock 1.25rem"/><ClockIcon size="1.5rem" aria-label="Clock 1.5rem"/></div>};
