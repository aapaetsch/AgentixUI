// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { RefreshIcon } from "./index";
const meta={title:"Icons/Actions/Refresh",component:RefreshIcon,args:{"aria-label":"Refresh"},tags:["autodocs"]} satisfies Meta<typeof RefreshIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><RefreshIcon size="0.875rem" aria-label="Refresh 0.875rem"/><RefreshIcon size="1rem" aria-label="Refresh 1rem"/><RefreshIcon size="1.25rem" aria-label="Refresh 1.25rem"/><RefreshIcon size="1.5rem" aria-label="Refresh 1.5rem"/></div>};
