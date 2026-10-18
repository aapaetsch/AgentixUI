// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { StarIcon } from "./index";
const meta={title:"Icons/Actions/Star",component:StarIcon,args:{"aria-label":"Star"},tags:["autodocs"]} satisfies Meta<typeof StarIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><StarIcon size="0.875rem" aria-label="Star 0.875rem"/><StarIcon size="1rem" aria-label="Star 1rem"/><StarIcon size="1.25rem" aria-label="Star 1.25rem"/><StarIcon size="1.5rem" aria-label="Star 1.5rem"/></div>};
