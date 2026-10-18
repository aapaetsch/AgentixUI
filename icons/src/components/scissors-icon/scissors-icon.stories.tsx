// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ScissorsIcon } from "./index";
const meta={title:"Icons/Actions/Scissors",component:ScissorsIcon,args:{"aria-label":"Scissors"},tags:["autodocs"]} satisfies Meta<typeof ScissorsIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ScissorsIcon size="0.875rem" aria-label="Scissors 0.875rem"/><ScissorsIcon size="1rem" aria-label="Scissors 1rem"/><ScissorsIcon size="1.25rem" aria-label="Scissors 1.25rem"/><ScissorsIcon size="1.5rem" aria-label="Scissors 1.5rem"/></div>};
