// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { AlignRightIcon } from "./index";
const meta={title:"Icons/Layout/Align Right",component:AlignRightIcon,args:{"aria-label":"Align Right"},tags:["autodocs"]} satisfies Meta<typeof AlignRightIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><AlignRightIcon size="0.875rem" aria-label="Align Right 0.875rem"/><AlignRightIcon size="1rem" aria-label="Align Right 1rem"/><AlignRightIcon size="1.25rem" aria-label="Align Right 1.25rem"/><AlignRightIcon size="1.5rem" aria-label="Align Right 1.5rem"/></div>};
