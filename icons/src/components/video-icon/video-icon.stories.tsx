// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { VideoIcon } from "./index";
const meta={title:"Icons/Media/Video",component:VideoIcon,args:{"aria-label":"Video"},tags:["autodocs"]} satisfies Meta<typeof VideoIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><VideoIcon size="0.875rem" aria-label="Video 0.875rem"/><VideoIcon size="1rem" aria-label="Video 1rem"/><VideoIcon size="1.25rem" aria-label="Video 1.25rem"/><VideoIcon size="1.5rem" aria-label="Video 1.5rem"/></div>};
