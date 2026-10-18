// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { LockIcon } from "./index";
const meta={title:"Icons/Identity/Lock",component:LockIcon,args:{"aria-label":"Lock"},tags:["autodocs"]} satisfies Meta<typeof LockIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><LockIcon size="0.875rem" aria-label="Lock 0.875rem"/><LockIcon size="1rem" aria-label="Lock 1rem"/><LockIcon size="1.25rem" aria-label="Lock 1.25rem"/><LockIcon size="1.5rem" aria-label="Lock 1.5rem"/></div>};
