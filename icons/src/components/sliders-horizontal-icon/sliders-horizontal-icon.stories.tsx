// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { SlidersHorizontalIcon } from "./index";
const meta={title:"Icons/Actions/Sliders Horizontal",component:SlidersHorizontalIcon,args:{"aria-label":"Sliders Horizontal"},tags:["autodocs"]} satisfies Meta<typeof SlidersHorizontalIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><SlidersHorizontalIcon size="0.875rem" aria-label="Sliders Horizontal 0.875rem"/><SlidersHorizontalIcon size="1rem" aria-label="Sliders Horizontal 1rem"/><SlidersHorizontalIcon size="1.25rem" aria-label="Sliders Horizontal 1.25rem"/><SlidersHorizontalIcon size="1.5rem" aria-label="Sliders Horizontal 1.5rem"/></div>};
