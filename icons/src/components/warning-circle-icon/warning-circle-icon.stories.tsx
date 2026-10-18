// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { WarningCircleIcon } from "./index";
const meta={title:"Icons/Feedback/Warning Circle",component:WarningCircleIcon,args:{"aria-label":"Warning Circle"},tags:["autodocs"]} satisfies Meta<typeof WarningCircleIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><WarningCircleIcon size="0.875rem" aria-label="Warning Circle 0.875rem"/><WarningCircleIcon size="1rem" aria-label="Warning Circle 1rem"/><WarningCircleIcon size="1.25rem" aria-label="Warning Circle 1.25rem"/><WarningCircleIcon size="1.5rem" aria-label="Warning Circle 1.5rem"/></div>};
