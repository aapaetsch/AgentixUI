// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ColumnsIcon } from "./index";
const meta={title:"Icons/Layout/Columns",component:ColumnsIcon,args:{"aria-label":"Columns"},tags:["autodocs"]} satisfies Meta<typeof ColumnsIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ColumnsIcon size="0.875rem" aria-label="Columns 0.875rem"/><ColumnsIcon size="1rem" aria-label="Columns 1rem"/><ColumnsIcon size="1.25rem" aria-label="Columns 1.25rem"/><ColumnsIcon size="1.5rem" aria-label="Columns 1.5rem"/></div>};
