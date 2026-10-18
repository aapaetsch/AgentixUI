// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { VolumeIcon } from "./index";
const meta={title:"Icons/Media/Volume",component:VolumeIcon,args:{"aria-label":"Volume"},tags:["autodocs"]} satisfies Meta<typeof VolumeIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><VolumeIcon size="0.875rem" aria-label="Volume 0.875rem"/><VolumeIcon size="1rem" aria-label="Volume 1rem"/><VolumeIcon size="1.25rem" aria-label="Volume 1.25rem"/><VolumeIcon size="1.5rem" aria-label="Volume 1.5rem"/></div>};
