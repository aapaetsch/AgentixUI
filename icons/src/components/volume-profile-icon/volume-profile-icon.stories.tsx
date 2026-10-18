// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { VolumeProfileIcon } from "./index";
const meta={title:"Icons/Charts/Volume Profile",component:VolumeProfileIcon,args:{"aria-label":"Volume Profile"},tags:["autodocs"]} satisfies Meta<typeof VolumeProfileIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><VolumeProfileIcon size="0.875rem" aria-label="Volume Profile 0.875rem"/><VolumeProfileIcon size="1rem" aria-label="Volume Profile 1rem"/><VolumeProfileIcon size="1.25rem" aria-label="Volume Profile 1.25rem"/><VolumeProfileIcon size="1.5rem" aria-label="Volume Profile 1.5rem"/></div>};
