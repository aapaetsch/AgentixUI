// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ArrowDownIcon } from "./index";
const meta={title:"Icons/Navigation/Arrow Down",component:ArrowDownIcon,args:{"aria-label":"Arrow Down"},tags:["autodocs"]} satisfies Meta<typeof ArrowDownIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ArrowDownIcon size="0.875rem" aria-label="Arrow Down 0.875rem"/><ArrowDownIcon size="1rem" aria-label="Arrow Down 1rem"/><ArrowDownIcon size="1.25rem" aria-label="Arrow Down 1.25rem"/><ArrowDownIcon size="1.5rem" aria-label="Arrow Down 1.5rem"/></div>};
