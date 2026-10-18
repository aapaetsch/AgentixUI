// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CameraIcon } from "./index";
const meta={title:"Icons/Media/Camera",component:CameraIcon,args:{"aria-label":"Camera"},tags:["autodocs"]} satisfies Meta<typeof CameraIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CameraIcon size="0.875rem" aria-label="Camera 0.875rem"/><CameraIcon size="1rem" aria-label="Camera 1rem"/><CameraIcon size="1.25rem" aria-label="Camera 1.25rem"/><CameraIcon size="1.5rem" aria-label="Camera 1.5rem"/></div>};
