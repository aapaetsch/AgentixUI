// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CalendarIcon } from "./index";
const meta={title:"Icons/Actions/Calendar",component:CalendarIcon,args:{"aria-label":"Calendar"},tags:["autodocs"]} satisfies Meta<typeof CalendarIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CalendarIcon size="0.875rem" aria-label="Calendar 0.875rem"/><CalendarIcon size="1rem" aria-label="Calendar 1rem"/><CalendarIcon size="1.25rem" aria-label="Calendar 1.25rem"/><CalendarIcon size="1.5rem" aria-label="Calendar 1.5rem"/></div>};
