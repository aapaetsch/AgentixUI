// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MusicIcon } from "./index";
const meta={title:"Icons/Media/Music",component:MusicIcon,args:{"aria-label":"Music"},tags:["autodocs"]} satisfies Meta<typeof MusicIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MusicIcon size="0.875rem" aria-label="Music 0.875rem"/><MusicIcon size="1rem" aria-label="Music 1rem"/><MusicIcon size="1.25rem" aria-label="Music 1.25rem"/><MusicIcon size="1.5rem" aria-label="Music 1.5rem"/></div>};
