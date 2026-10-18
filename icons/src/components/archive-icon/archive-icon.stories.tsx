// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ArchiveIcon } from "./index";
const meta={title:"Icons/Files/Archive",component:ArchiveIcon,args:{"aria-label":"Archive"},tags:["autodocs"]} satisfies Meta<typeof ArchiveIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ArchiveIcon size="0.875rem" aria-label="Archive 0.875rem"/><ArchiveIcon size="1rem" aria-label="Archive 1rem"/><ArchiveIcon size="1.25rem" aria-label="Archive 1.25rem"/><ArchiveIcon size="1.5rem" aria-label="Archive 1.5rem"/></div>};
