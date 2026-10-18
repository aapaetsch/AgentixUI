// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CalendarDaysIcon } from "./index";
const meta={title:"Icons/Actions/Calendar Days",component:CalendarDaysIcon,args:{"aria-label":"Calendar Days"},tags:["autodocs"]} satisfies Meta<typeof CalendarDaysIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CalendarDaysIcon size="0.875rem" aria-label="Calendar Days 0.875rem"/><CalendarDaysIcon size="1rem" aria-label="Calendar Days 1rem"/><CalendarDaysIcon size="1.25rem" aria-label="Calendar Days 1.25rem"/><CalendarDaysIcon size="1.5rem" aria-label="Calendar Days 1.5rem"/></div>};
