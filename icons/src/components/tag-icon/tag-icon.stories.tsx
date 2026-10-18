// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { TagIcon } from "./index";
const meta={title:"Icons/Actions/Tag",component:TagIcon,args:{"aria-label":"Tag"},tags:["autodocs"]} satisfies Meta<typeof TagIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><TagIcon size="0.875rem" aria-label="Tag 0.875rem"/><TagIcon size="1rem" aria-label="Tag 1rem"/><TagIcon size="1.25rem" aria-label="Tag 1.25rem"/><TagIcon size="1.5rem" aria-label="Tag 1.5rem"/></div>};
