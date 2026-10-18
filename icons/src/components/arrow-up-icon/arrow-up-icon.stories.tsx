// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpIcon } from "./index";
const meta={title:"Icons/Navigation/Arrow Up",component:ArrowUpIcon,args:{"aria-label":"Arrow Up"},tags:["autodocs"]} satisfies Meta<typeof ArrowUpIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ArrowUpIcon size="0.875rem" aria-label="Arrow Up 0.875rem"/><ArrowUpIcon size="1rem" aria-label="Arrow Up 1rem"/><ArrowUpIcon size="1.25rem" aria-label="Arrow Up 1.25rem"/><ArrowUpIcon size="1.5rem" aria-label="Arrow Up 1.5rem"/></div>};
