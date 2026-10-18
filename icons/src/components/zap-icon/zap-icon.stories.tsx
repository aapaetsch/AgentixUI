// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ZapIcon } from "./index";
const meta={title:"Icons/Actions/Zap",component:ZapIcon,args:{"aria-label":"Zap"},tags:["autodocs"]} satisfies Meta<typeof ZapIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ZapIcon size="0.875rem" aria-label="Zap 0.875rem"/><ZapIcon size="1rem" aria-label="Zap 1rem"/><ZapIcon size="1.25rem" aria-label="Zap 1.25rem"/><ZapIcon size="1.5rem" aria-label="Zap 1.5rem"/></div>};
