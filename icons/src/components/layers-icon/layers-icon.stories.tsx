// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { LayersIcon } from "./index";
const meta={title:"Icons/Actions/Layers",component:LayersIcon,args:{"aria-label":"Layers"},tags:["autodocs"]} satisfies Meta<typeof LayersIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><LayersIcon size="0.875rem" aria-label="Layers 0.875rem"/><LayersIcon size="1rem" aria-label="Layers 1rem"/><LayersIcon size="1.25rem" aria-label="Layers 1.25rem"/><LayersIcon size="1.5rem" aria-label="Layers 1.5rem"/></div>};
