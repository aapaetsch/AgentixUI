// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronLeftIcon } from "./index";
const meta={title:"Icons/Navigation/Chevron Left",component:ChevronLeftIcon,args:{"aria-label":"Chevron Left"},tags:["autodocs"]} satisfies Meta<typeof ChevronLeftIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ChevronLeftIcon size="0.875rem" aria-label="Chevron Left 0.875rem"/><ChevronLeftIcon size="1rem" aria-label="Chevron Left 1rem"/><ChevronLeftIcon size="1.25rem" aria-label="Chevron Left 1.25rem"/><ChevronLeftIcon size="1.5rem" aria-label="Chevron Left 1.5rem"/></div>};
