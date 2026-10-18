// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MenuIcon } from "./index";
const meta={title:"Icons/Navigation/Menu",component:MenuIcon,args:{"aria-label":"Menu"},tags:["autodocs"]} satisfies Meta<typeof MenuIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MenuIcon size="0.875rem" aria-label="Menu 0.875rem"/><MenuIcon size="1rem" aria-label="Menu 1rem"/><MenuIcon size="1.25rem" aria-label="Menu 1.25rem"/><MenuIcon size="1.5rem" aria-label="Menu 1.5rem"/></div>};
