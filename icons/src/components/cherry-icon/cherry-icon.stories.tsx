// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CherryIcon } from "./index";
const meta={title:"Icons/Nature/Cherry",component:CherryIcon,args:{"aria-label":"Cherry"},tags:["autodocs"]} satisfies Meta<typeof CherryIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CherryIcon size="0.875rem" aria-label="Cherry 0.875rem"/><CherryIcon size="1rem" aria-label="Cherry 1rem"/><CherryIcon size="1.25rem" aria-label="Cherry 1.25rem"/><CherryIcon size="1.5rem" aria-label="Cherry 1.5rem"/></div>};
