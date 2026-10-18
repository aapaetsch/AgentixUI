// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { DownloadIcon } from "./index";
const meta={title:"Icons/Files/Download",component:DownloadIcon,args:{"aria-label":"Download"},tags:["autodocs"]} satisfies Meta<typeof DownloadIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><DownloadIcon size="0.875rem" aria-label="Download 0.875rem"/><DownloadIcon size="1rem" aria-label="Download 1rem"/><DownloadIcon size="1.25rem" aria-label="Download 1.25rem"/><DownloadIcon size="1.5rem" aria-label="Download 1.5rem"/></div>};
