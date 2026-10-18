// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { SendIcon } from "./index";
const meta={title:"Icons/Communication/Send",component:SendIcon,args:{"aria-label":"Send"},tags:["autodocs"]} satisfies Meta<typeof SendIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><SendIcon size="0.875rem" aria-label="Send 0.875rem"/><SendIcon size="1rem" aria-label="Send 1rem"/><SendIcon size="1.25rem" aria-label="Send 1.25rem"/><SendIcon size="1.5rem" aria-label="Send 1.5rem"/></div>};
