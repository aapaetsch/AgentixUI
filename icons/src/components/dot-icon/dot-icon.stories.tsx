// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { DotIcon } from "./index";
const meta={title:"Icons/Actions/Dot",component:DotIcon,args:{"aria-label":"Dot"},tags:["autodocs"]} satisfies Meta<typeof DotIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><DotIcon size="0.875rem" aria-label="Dot 0.875rem"/><DotIcon size="1rem" aria-label="Dot 1rem"/><DotIcon size="1.25rem" aria-label="Dot 1.25rem"/><DotIcon size="1.5rem" aria-label="Dot 1.5rem"/></div>};
