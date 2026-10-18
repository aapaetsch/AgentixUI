// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PhoneIcon } from "./index";
const meta={title:"Icons/Communication/Phone",component:PhoneIcon,args:{"aria-label":"Phone"},tags:["autodocs"]} satisfies Meta<typeof PhoneIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PhoneIcon size="0.875rem" aria-label="Phone 0.875rem"/><PhoneIcon size="1rem" aria-label="Phone 1rem"/><PhoneIcon size="1.25rem" aria-label="Phone 1.25rem"/><PhoneIcon size="1.5rem" aria-label="Phone 1.5rem"/></div>};
