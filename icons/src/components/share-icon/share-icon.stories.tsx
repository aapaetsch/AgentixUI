// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ShareIcon } from "./index";
const meta={title:"Icons/Communication/Share",component:ShareIcon,args:{"aria-label":"Share"},tags:["autodocs"]} satisfies Meta<typeof ShareIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ShareIcon size="0.875rem" aria-label="Share 0.875rem"/><ShareIcon size="1rem" aria-label="Share 1rem"/><ShareIcon size="1.25rem" aria-label="Share 1.25rem"/><ShareIcon size="1.5rem" aria-label="Share 1.5rem"/></div>};
