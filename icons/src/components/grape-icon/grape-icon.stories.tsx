// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { GrapeIcon } from "./index";
const meta={title:"Icons/Nature/Grape",component:GrapeIcon,args:{"aria-label":"Grape"},tags:["autodocs"]} satisfies Meta<typeof GrapeIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><GrapeIcon size="0.875rem" aria-label="Grape 0.875rem"/><GrapeIcon size="1rem" aria-label="Grape 1rem"/><GrapeIcon size="1.25rem" aria-label="Grape 1.25rem"/><GrapeIcon size="1.5rem" aria-label="Grape 1.5rem"/></div>};
