// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ResizeIcon } from "./index";
const meta={title:"Icons/Layout/Resize",component:ResizeIcon,args:{"aria-label":"Resize"},tags:["autodocs"]} satisfies Meta<typeof ResizeIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ResizeIcon size="0.875rem" aria-label="Resize 0.875rem"/><ResizeIcon size="1rem" aria-label="Resize 1rem"/><ResizeIcon size="1.25rem" aria-label="Resize 1.25rem"/><ResizeIcon size="1.5rem" aria-label="Resize 1.5rem"/></div>};
