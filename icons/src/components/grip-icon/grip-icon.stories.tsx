// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { GripIcon } from "./index";
const meta={title:"Icons/Layout/Grip",component:GripIcon,args:{"aria-label":"Grip"},tags:["autodocs"]} satisfies Meta<typeof GripIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><GripIcon size="0.875rem" aria-label="Grip 0.875rem"/><GripIcon size="1rem" aria-label="Grip 1rem"/><GripIcon size="1.25rem" aria-label="Grip 1.25rem"/><GripIcon size="1.5rem" aria-label="Grip 1.5rem"/></div>};
