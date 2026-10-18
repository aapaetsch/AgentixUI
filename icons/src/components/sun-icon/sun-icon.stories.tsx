// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { SunIcon } from "./index";
const meta={title:"Icons/Nature/Sun",component:SunIcon,args:{"aria-label":"Sun"},tags:["autodocs"]} satisfies Meta<typeof SunIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><SunIcon size="0.875rem" aria-label="Sun 0.875rem"/><SunIcon size="1rem" aria-label="Sun 1rem"/><SunIcon size="1.25rem" aria-label="Sun 1.25rem"/><SunIcon size="1.5rem" aria-label="Sun 1.5rem"/></div>};
