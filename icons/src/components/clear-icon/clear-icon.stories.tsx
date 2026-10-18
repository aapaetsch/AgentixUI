// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ClearIcon } from "./index";
const meta={title:"Icons/Actions/Clear",component:ClearIcon,args:{"aria-label":"Clear"},tags:["autodocs"]} satisfies Meta<typeof ClearIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ClearIcon size="0.875rem" aria-label="Clear 0.875rem"/><ClearIcon size="1rem" aria-label="Clear 1rem"/><ClearIcon size="1.25rem" aria-label="Clear 1.25rem"/><ClearIcon size="1.5rem" aria-label="Clear 1.5rem"/></div>};
