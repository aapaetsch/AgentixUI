// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { TrashIcon } from "./index";
const meta={title:"Icons/Actions/Trash",component:TrashIcon,args:{"aria-label":"Trash"},tags:["autodocs"]} satisfies Meta<typeof TrashIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><TrashIcon size="0.875rem" aria-label="Trash 0.875rem"/><TrashIcon size="1rem" aria-label="Trash 1rem"/><TrashIcon size="1.25rem" aria-label="Trash 1.25rem"/><TrashIcon size="1.5rem" aria-label="Trash 1.5rem"/></div>};
