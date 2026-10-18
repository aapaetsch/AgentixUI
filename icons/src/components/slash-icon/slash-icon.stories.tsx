// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { SlashIcon } from "./index";
const meta={title:"Icons/Actions/Slash",component:SlashIcon,args:{"aria-label":"Slash"},tags:["autodocs"]} satisfies Meta<typeof SlashIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><SlashIcon size="0.875rem" aria-label="Slash 0.875rem"/><SlashIcon size="1rem" aria-label="Slash 1rem"/><SlashIcon size="1.25rem" aria-label="Slash 1.25rem"/><SlashIcon size="1.5rem" aria-label="Slash 1.5rem"/></div>};
