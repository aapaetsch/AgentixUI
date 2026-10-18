// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon } from "./index";
const meta={title:"Icons/Feedback/Check",component:CheckIcon,args:{"aria-label":"Check"},tags:["autodocs"]} satisfies Meta<typeof CheckIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CheckIcon size="0.875rem" aria-label="Check 0.875rem"/><CheckIcon size="1rem" aria-label="Check 1rem"/><CheckIcon size="1.25rem" aria-label="Check 1.25rem"/><CheckIcon size="1.5rem" aria-label="Check 1.5rem"/></div>};
