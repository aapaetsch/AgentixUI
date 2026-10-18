// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { HeartIcon } from "./index";
const meta={title:"Icons/Actions/Heart",component:HeartIcon,args:{"aria-label":"Heart"},tags:["autodocs"]} satisfies Meta<typeof HeartIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><HeartIcon size="0.875rem" aria-label="Heart 0.875rem"/><HeartIcon size="1rem" aria-label="Heart 1rem"/><HeartIcon size="1.25rem" aria-label="Heart 1.25rem"/><HeartIcon size="1.5rem" aria-label="Heart 1.5rem"/></div>};
