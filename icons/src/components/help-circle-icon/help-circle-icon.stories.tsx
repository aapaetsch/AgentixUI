// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { HelpCircleIcon } from "./index";
const meta={title:"Icons/Feedback/Help Circle",component:HelpCircleIcon,args:{"aria-label":"Help Circle"},tags:["autodocs"]} satisfies Meta<typeof HelpCircleIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><HelpCircleIcon size="0.875rem" aria-label="Help Circle 0.875rem"/><HelpCircleIcon size="1rem" aria-label="Help Circle 1rem"/><HelpCircleIcon size="1.25rem" aria-label="Help Circle 1.25rem"/><HelpCircleIcon size="1.5rem" aria-label="Help Circle 1.5rem"/></div>};
