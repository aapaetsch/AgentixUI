// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MoonIcon } from "./index";
const meta={title:"Icons/Nature/Moon",component:MoonIcon,args:{"aria-label":"Moon"},tags:["autodocs"]} satisfies Meta<typeof MoonIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MoonIcon size="0.875rem" aria-label="Moon 0.875rem"/><MoonIcon size="1rem" aria-label="Moon 1rem"/><MoonIcon size="1.25rem" aria-label="Moon 1.25rem"/><MoonIcon size="1.5rem" aria-label="Moon 1.5rem"/></div>};
