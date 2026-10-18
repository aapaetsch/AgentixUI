// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { AppleIcon } from "./index";
const meta={title:"Icons/Nature/Apple",component:AppleIcon,args:{"aria-label":"Apple"},tags:["autodocs"]} satisfies Meta<typeof AppleIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><AppleIcon size="0.875rem" aria-label="Apple 0.875rem"/><AppleIcon size="1rem" aria-label="Apple 1rem"/><AppleIcon size="1.25rem" aria-label="Apple 1.25rem"/><AppleIcon size="1.5rem" aria-label="Apple 1.5rem"/></div>};
