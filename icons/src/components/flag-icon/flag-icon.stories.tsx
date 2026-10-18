// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { FlagIcon } from "./index";
const meta={title:"Icons/Actions/Flag",component:FlagIcon,args:{"aria-label":"Flag"},tags:["autodocs"]} satisfies Meta<typeof FlagIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><FlagIcon size="0.875rem" aria-label="Flag 0.875rem"/><FlagIcon size="1rem" aria-label="Flag 1rem"/><FlagIcon size="1.25rem" aria-label="Flag 1.25rem"/><FlagIcon size="1.5rem" aria-label="Flag 1.5rem"/></div>};
