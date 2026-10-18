// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PauseIcon } from "./index";
const meta={title:"Icons/Media/Pause",component:PauseIcon,args:{"aria-label":"Pause"},tags:["autodocs"]} satisfies Meta<typeof PauseIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PauseIcon size="0.875rem" aria-label="Pause 0.875rem"/><PauseIcon size="1rem" aria-label="Pause 1rem"/><PauseIcon size="1.25rem" aria-label="Pause 1.25rem"/><PauseIcon size="1.5rem" aria-label="Pause 1.5rem"/></div>};
