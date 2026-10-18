// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { BuildingIcon } from "./index";
const meta={title:"Icons/Identity/Building",component:BuildingIcon,args:{"aria-label":"Building"},tags:["autodocs"]} satisfies Meta<typeof BuildingIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><BuildingIcon size="0.875rem" aria-label="Building 0.875rem"/><BuildingIcon size="1rem" aria-label="Building 1rem"/><BuildingIcon size="1.25rem" aria-label="Building 1.25rem"/><BuildingIcon size="1.5rem" aria-label="Building 1.5rem"/></div>};
