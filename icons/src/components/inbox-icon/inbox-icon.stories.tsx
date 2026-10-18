// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { InboxIcon } from "./index";
const meta={title:"Icons/Files/Inbox",component:InboxIcon,args:{"aria-label":"Inbox"},tags:["autodocs"]} satisfies Meta<typeof InboxIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><InboxIcon size="0.875rem" aria-label="Inbox 0.875rem"/><InboxIcon size="1rem" aria-label="Inbox 1rem"/><InboxIcon size="1.25rem" aria-label="Inbox 1.25rem"/><InboxIcon size="1.5rem" aria-label="Inbox 1.5rem"/></div>};
