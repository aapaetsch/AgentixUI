// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MailIcon } from "./index";
const meta={title:"Icons/Communication/Mail",component:MailIcon,args:{"aria-label":"Mail"},tags:["autodocs"]} satisfies Meta<typeof MailIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MailIcon size="0.875rem" aria-label="Mail 0.875rem"/><MailIcon size="1rem" aria-label="Mail 1rem"/><MailIcon size="1.25rem" aria-label="Mail 1.25rem"/><MailIcon size="1.5rem" aria-label="Mail 1.5rem"/></div>};
