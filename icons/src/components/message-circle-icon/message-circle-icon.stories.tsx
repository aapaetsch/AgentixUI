// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MessageCircleIcon } from "./index";
const meta={title:"Icons/Communication/Message Circle",component:MessageCircleIcon,args:{"aria-label":"Message Circle"},tags:["autodocs"]} satisfies Meta<typeof MessageCircleIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MessageCircleIcon size="0.875rem" aria-label="Message Circle 0.875rem"/><MessageCircleIcon size="1rem" aria-label="Message Circle 1rem"/><MessageCircleIcon size="1.25rem" aria-label="Message Circle 1.25rem"/><MessageCircleIcon size="1.5rem" aria-label="Message Circle 1.5rem"/></div>};
