// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { AlignCenterIcon } from "./index";
const meta={title:"Icons/Layout/Align Center",component:AlignCenterIcon,args:{"aria-label":"Align Center"},tags:["autodocs"]} satisfies Meta<typeof AlignCenterIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><AlignCenterIcon size="0.875rem" aria-label="Align Center 0.875rem"/><AlignCenterIcon size="1rem" aria-label="Align Center 1rem"/><AlignCenterIcon size="1.25rem" aria-label="Align Center 1.25rem"/><AlignCenterIcon size="1.5rem" aria-label="Align Center 1.5rem"/></div>};
