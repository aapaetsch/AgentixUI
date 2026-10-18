// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PlayIcon } from "./index";
const meta={title:"Icons/Media/Play",component:PlayIcon,args:{"aria-label":"Play"},tags:["autodocs"]} satisfies Meta<typeof PlayIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PlayIcon size="0.875rem" aria-label="Play 0.875rem"/><PlayIcon size="1rem" aria-label="Play 1rem"/><PlayIcon size="1.25rem" aria-label="Play 1.25rem"/><PlayIcon size="1.5rem" aria-label="Play 1.5rem"/></div>};
