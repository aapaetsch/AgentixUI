// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ImageIcon } from "./index";
const meta={title:"Icons/Media/Image",component:ImageIcon,args:{"aria-label":"Image"},tags:["autodocs"]} satisfies Meta<typeof ImageIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ImageIcon size="0.875rem" aria-label="Image 0.875rem"/><ImageIcon size="1rem" aria-label="Image 1rem"/><ImageIcon size="1.25rem" aria-label="Image 1.25rem"/><ImageIcon size="1.5rem" aria-label="Image 1.5rem"/></div>};
