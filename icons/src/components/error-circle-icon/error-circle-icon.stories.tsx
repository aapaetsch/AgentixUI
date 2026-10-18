// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ErrorCircleIcon } from "./index";
const meta={title:"Icons/Feedback/Error Circle",component:ErrorCircleIcon,args:{"aria-label":"Error Circle"},tags:["autodocs"]} satisfies Meta<typeof ErrorCircleIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ErrorCircleIcon size="0.875rem" aria-label="Error Circle 0.875rem"/><ErrorCircleIcon size="1rem" aria-label="Error Circle 1rem"/><ErrorCircleIcon size="1.25rem" aria-label="Error Circle 1.25rem"/><ErrorCircleIcon size="1.5rem" aria-label="Error Circle 1.5rem"/></div>};
