// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { SquareIcon } from "./index";
const meta={title:"Icons/Actions/Square",component:SquareIcon,args:{"aria-label":"Square"},tags:["autodocs"]} satisfies Meta<typeof SquareIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><SquareIcon size="0.875rem" aria-label="Square 0.875rem"/><SquareIcon size="1rem" aria-label="Square 1rem"/><SquareIcon size="1.25rem" aria-label="Square 1.25rem"/><SquareIcon size="1.5rem" aria-label="Square 1.5rem"/></div>};
