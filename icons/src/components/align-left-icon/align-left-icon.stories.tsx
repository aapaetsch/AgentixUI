// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { AlignLeftIcon } from "./index";
const meta={title:"Icons/Layout/Align Left",component:AlignLeftIcon,args:{"aria-label":"Align Left"},tags:["autodocs"]} satisfies Meta<typeof AlignLeftIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><AlignLeftIcon size="0.875rem" aria-label="Align Left 0.875rem"/><AlignLeftIcon size="1rem" aria-label="Align Left 1rem"/><AlignLeftIcon size="1.25rem" aria-label="Align Left 1.25rem"/><AlignLeftIcon size="1.5rem" aria-label="Align Left 1.5rem"/></div>};
