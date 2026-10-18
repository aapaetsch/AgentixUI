// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { FullscreenIcon } from "./index";
const meta={title:"Icons/Navigation/Fullscreen",component:FullscreenIcon,args:{"aria-label":"Fullscreen"},tags:["autodocs"]} satisfies Meta<typeof FullscreenIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><FullscreenIcon size="0.875rem" aria-label="Fullscreen 0.875rem"/><FullscreenIcon size="1rem" aria-label="Fullscreen 1rem"/><FullscreenIcon size="1.25rem" aria-label="Fullscreen 1.25rem"/><FullscreenIcon size="1.5rem" aria-label="Fullscreen 1.5rem"/></div>};
