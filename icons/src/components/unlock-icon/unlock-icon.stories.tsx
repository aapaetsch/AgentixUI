// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { UnlockIcon } from "./index";
const meta={title:"Icons/Identity/Unlock",component:UnlockIcon,args:{"aria-label":"Unlock"},tags:["autodocs"]} satisfies Meta<typeof UnlockIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><UnlockIcon size="0.875rem" aria-label="Unlock 0.875rem"/><UnlockIcon size="1rem" aria-label="Unlock 1rem"/><UnlockIcon size="1.25rem" aria-label="Unlock 1.25rem"/><UnlockIcon size="1.5rem" aria-label="Unlock 1.5rem"/></div>};
