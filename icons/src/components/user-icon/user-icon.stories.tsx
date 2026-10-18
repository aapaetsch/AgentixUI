// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { UserIcon } from "./index";
const meta={title:"Icons/Identity/User",component:UserIcon,args:{"aria-label":"User"},tags:["autodocs"]} satisfies Meta<typeof UserIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><UserIcon size="0.875rem" aria-label="User 0.875rem"/><UserIcon size="1rem" aria-label="User 1rem"/><UserIcon size="1.25rem" aria-label="User 1.25rem"/><UserIcon size="1.5rem" aria-label="User 1.5rem"/></div>};
