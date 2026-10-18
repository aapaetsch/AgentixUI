// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CloseIcon } from "./index";
const meta={title:"Icons/Actions/Close",component:CloseIcon,args:{"aria-label":"Close"},tags:["autodocs"]} satisfies Meta<typeof CloseIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CloseIcon size="0.875rem" aria-label="Close 0.875rem"/><CloseIcon size="1rem" aria-label="Close 1rem"/><CloseIcon size="1.25rem" aria-label="Close 1.25rem"/><CloseIcon size="1.5rem" aria-label="Close 1.5rem"/></div>};
