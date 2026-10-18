// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircleIcon } from "./index";
const meta={title:"Icons/Feedback/Check Circle",component:CheckCircleIcon,args:{"aria-label":"Check Circle"},tags:["autodocs"]} satisfies Meta<typeof CheckCircleIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CheckCircleIcon size="0.875rem" aria-label="Check Circle 0.875rem"/><CheckCircleIcon size="1rem" aria-label="Check Circle 1rem"/><CheckCircleIcon size="1.25rem" aria-label="Check Circle 1.25rem"/><CheckCircleIcon size="1.5rem" aria-label="Check Circle 1.5rem"/></div>};
