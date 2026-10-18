// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { FileIcon } from "./index";
const meta={title:"Icons/Files/File",component:FileIcon,args:{"aria-label":"File"},tags:["autodocs"]} satisfies Meta<typeof FileIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><FileIcon size="0.875rem" aria-label="File 0.875rem"/><FileIcon size="1rem" aria-label="File 1rem"/><FileIcon size="1.25rem" aria-label="File 1.25rem"/><FileIcon size="1.5rem" aria-label="File 1.5rem"/></div>};
