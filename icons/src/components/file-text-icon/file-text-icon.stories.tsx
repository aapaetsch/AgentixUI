// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { FileTextIcon } from "./index";
const meta={title:"Icons/Files/File Text",component:FileTextIcon,args:{"aria-label":"File Text"},tags:["autodocs"]} satisfies Meta<typeof FileTextIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><FileTextIcon size="0.875rem" aria-label="File Text 0.875rem"/><FileTextIcon size="1rem" aria-label="File Text 1rem"/><FileTextIcon size="1.25rem" aria-label="File Text 1.25rem"/><FileTextIcon size="1.5rem" aria-label="File Text 1.5rem"/></div>};
