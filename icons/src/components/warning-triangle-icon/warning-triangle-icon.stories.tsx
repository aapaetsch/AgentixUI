// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { WarningTriangleIcon } from "./index";
const meta={title:"Icons/Feedback/Warning Triangle",component:WarningTriangleIcon,args:{"aria-label":"Warning Triangle"},tags:["autodocs"]} satisfies Meta<typeof WarningTriangleIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><WarningTriangleIcon size="0.875rem" aria-label="Warning Triangle 0.875rem"/><WarningTriangleIcon size="1rem" aria-label="Warning Triangle 1rem"/><WarningTriangleIcon size="1.25rem" aria-label="Warning Triangle 1.25rem"/><WarningTriangleIcon size="1.5rem" aria-label="Warning Triangle 1.5rem"/></div>};
