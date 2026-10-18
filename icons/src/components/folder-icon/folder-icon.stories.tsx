// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { FolderIcon } from "./index";
const meta={title:"Icons/Files/Folder",component:FolderIcon,args:{"aria-label":"Folder"},tags:["autodocs"]} satisfies Meta<typeof FolderIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><FolderIcon size="0.875rem" aria-label="Folder 0.875rem"/><FolderIcon size="1rem" aria-label="Folder 1rem"/><FolderIcon size="1.25rem" aria-label="Folder 1.25rem"/><FolderIcon size="1.5rem" aria-label="Folder 1.5rem"/></div>};
