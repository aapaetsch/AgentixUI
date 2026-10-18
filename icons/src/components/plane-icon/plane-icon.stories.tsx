// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PlaneIcon } from "./index";
const meta={title:"Icons/Commerce/Plane",component:PlaneIcon,args:{"aria-label":"Plane"},tags:["autodocs"]} satisfies Meta<typeof PlaneIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PlaneIcon size="0.875rem" aria-label="Plane 0.875rem"/><PlaneIcon size="1rem" aria-label="Plane 1rem"/><PlaneIcon size="1.25rem" aria-label="Plane 1.25rem"/><PlaneIcon size="1.5rem" aria-label="Plane 1.5rem"/></div>};
