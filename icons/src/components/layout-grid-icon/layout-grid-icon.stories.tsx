// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGridIcon } from "./index";
const meta={title:"Icons/Layout/Layout Grid",component:LayoutGridIcon,args:{"aria-label":"Layout Grid"},tags:["autodocs"]} satisfies Meta<typeof LayoutGridIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><LayoutGridIcon size="0.875rem" aria-label="Layout Grid 0.875rem"/><LayoutGridIcon size="1rem" aria-label="Layout Grid 1rem"/><LayoutGridIcon size="1.25rem" aria-label="Layout Grid 1.25rem"/><LayoutGridIcon size="1.5rem" aria-label="Layout Grid 1.5rem"/></div>};
