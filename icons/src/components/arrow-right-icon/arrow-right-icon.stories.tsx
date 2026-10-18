// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon } from "./index";
const meta={title:"Icons/Navigation/Arrow Right",component:ArrowRightIcon,args:{"aria-label":"Arrow Right"},tags:["autodocs"]} satisfies Meta<typeof ArrowRightIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ArrowRightIcon size="0.875rem" aria-label="Arrow Right 0.875rem"/><ArrowRightIcon size="1rem" aria-label="Arrow Right 1rem"/><ArrowRightIcon size="1.25rem" aria-label="Arrow Right 1.25rem"/><ArrowRightIcon size="1.5rem" aria-label="Arrow Right 1.5rem"/></div>};
