// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { UnderlineIcon } from "./index";
const meta={title:"Icons/Actions/Underline",component:UnderlineIcon,args:{"aria-label":"Underline"},tags:["autodocs"]} satisfies Meta<typeof UnderlineIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><UnderlineIcon size="0.875rem" aria-label="Underline 0.875rem"/><UnderlineIcon size="1rem" aria-label="Underline 1rem"/><UnderlineIcon size="1.25rem" aria-label="Underline 1.25rem"/><UnderlineIcon size="1.5rem" aria-label="Underline 1.5rem"/></div>};
