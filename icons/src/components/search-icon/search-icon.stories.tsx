// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { SearchIcon } from "./index";
const meta={title:"Icons/Actions/Search",component:SearchIcon,args:{"aria-label":"Search"},tags:["autodocs"]} satisfies Meta<typeof SearchIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><SearchIcon size="0.875rem" aria-label="Search 0.875rem"/><SearchIcon size="1rem" aria-label="Search 1rem"/><SearchIcon size="1.25rem" aria-label="Search 1.25rem"/><SearchIcon size="1.5rem" aria-label="Search 1.5rem"/></div>};
