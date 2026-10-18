// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { FilterIcon } from "./index";
const meta={title:"Icons/Actions/Filter",component:FilterIcon,args:{"aria-label":"Filter"},tags:["autodocs"]} satisfies Meta<typeof FilterIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><FilterIcon size="0.875rem" aria-label="Filter 0.875rem"/><FilterIcon size="1rem" aria-label="Filter 1rem"/><FilterIcon size="1.25rem" aria-label="Filter 1.25rem"/><FilterIcon size="1.5rem" aria-label="Filter 1.5rem"/></div>};
