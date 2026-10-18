// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { EyeIcon } from "./index";
const meta={title:"Icons/Actions/Eye",component:EyeIcon,args:{"aria-label":"Eye"},tags:["autodocs"]} satisfies Meta<typeof EyeIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><EyeIcon size="0.875rem" aria-label="Eye 0.875rem"/><EyeIcon size="1rem" aria-label="Eye 1rem"/><EyeIcon size="1.25rem" aria-label="Eye 1.25rem"/><EyeIcon size="1.5rem" aria-label="Eye 1.5rem"/></div>};
