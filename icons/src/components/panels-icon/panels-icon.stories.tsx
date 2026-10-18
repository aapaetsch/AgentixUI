// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PanelsIcon } from "./index";
const meta={title:"Icons/Layout/Panels",component:PanelsIcon,args:{"aria-label":"Panels"},tags:["autodocs"]} satisfies Meta<typeof PanelsIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PanelsIcon size="0.875rem" aria-label="Panels 0.875rem"/><PanelsIcon size="1rem" aria-label="Panels 1rem"/><PanelsIcon size="1.25rem" aria-label="Panels 1.25rem"/><PanelsIcon size="1.5rem" aria-label="Panels 1.5rem"/></div>};
