// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ExternalLinkIcon } from "./index";
const meta={title:"Icons/Navigation/External Link",component:ExternalLinkIcon,args:{"aria-label":"External Link"},tags:["autodocs"]} satisfies Meta<typeof ExternalLinkIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ExternalLinkIcon size="0.875rem" aria-label="External Link 0.875rem"/><ExternalLinkIcon size="1rem" aria-label="External Link 1rem"/><ExternalLinkIcon size="1.25rem" aria-label="External Link 1.25rem"/><ExternalLinkIcon size="1.5rem" aria-label="External Link 1.5rem"/></div>};
