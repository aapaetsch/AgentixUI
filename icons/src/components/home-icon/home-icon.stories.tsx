// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { HomeIcon } from "./index";
const meta={title:"Icons/Navigation/Home",component:HomeIcon,args:{"aria-label":"Home"},tags:["autodocs"]} satisfies Meta<typeof HomeIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><HomeIcon size="0.875rem" aria-label="Home 0.875rem"/><HomeIcon size="1rem" aria-label="Home 1rem"/><HomeIcon size="1.25rem" aria-label="Home 1.25rem"/><HomeIcon size="1.5rem" aria-label="Home 1.5rem"/></div>};
