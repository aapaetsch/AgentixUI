// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { EditIcon } from "./index";
const meta={title:"Icons/Actions/Edit",component:EditIcon,args:{"aria-label":"Edit"},tags:["autodocs"]} satisfies Meta<typeof EditIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><EditIcon size="0.875rem" aria-label="Edit 0.875rem"/><EditIcon size="1rem" aria-label="Edit 1rem"/><EditIcon size="1.25rem" aria-label="Edit 1.25rem"/><EditIcon size="1.5rem" aria-label="Edit 1.5rem"/></div>};
