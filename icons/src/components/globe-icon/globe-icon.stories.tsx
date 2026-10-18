// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { GlobeIcon } from "./index";
const meta={title:"Icons/Actions/Globe",component:GlobeIcon,args:{"aria-label":"Globe"},tags:["autodocs"]} satisfies Meta<typeof GlobeIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><GlobeIcon size="0.875rem" aria-label="Globe 0.875rem"/><GlobeIcon size="1rem" aria-label="Globe 1rem"/><GlobeIcon size="1.25rem" aria-label="Globe 1.25rem"/><GlobeIcon size="1.5rem" aria-label="Globe 1.5rem"/></div>};
