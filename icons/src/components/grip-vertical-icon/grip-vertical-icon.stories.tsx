// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { GripVerticalIcon } from "./index";
const meta={title:"Icons/Layout/Grip Vertical",component:GripVerticalIcon,args:{"aria-label":"Grip Vertical"},tags:["autodocs"]} satisfies Meta<typeof GripVerticalIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><GripVerticalIcon size="0.875rem" aria-label="Grip Vertical 0.875rem"/><GripVerticalIcon size="1rem" aria-label="Grip Vertical 1rem"/><GripVerticalIcon size="1.25rem" aria-label="Grip Vertical 1.25rem"/><GripVerticalIcon size="1.5rem" aria-label="Grip Vertical 1.5rem"/></div>};
