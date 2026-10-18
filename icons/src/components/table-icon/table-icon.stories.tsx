// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { TableIcon } from "./index";
const meta={title:"Icons/Layout/Table",component:TableIcon,args:{"aria-label":"Table"},tags:["autodocs"]} satisfies Meta<typeof TableIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><TableIcon size="0.875rem" aria-label="Table 0.875rem"/><TableIcon size="1rem" aria-label="Table 1rem"/><TableIcon size="1.25rem" aria-label="Table 1.25rem"/><TableIcon size="1.5rem" aria-label="Table 1.5rem"/></div>};
