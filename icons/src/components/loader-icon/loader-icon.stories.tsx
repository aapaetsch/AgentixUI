// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { LoaderIcon } from "./index";
const meta={title:"Icons/Feedback/Loader",component:LoaderIcon,args:{"aria-label":"Loader"},tags:["autodocs"]} satisfies Meta<typeof LoaderIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><LoaderIcon size="0.875rem" aria-label="Loader 0.875rem"/><LoaderIcon size="1rem" aria-label="Loader 1rem"/><LoaderIcon size="1.25rem" aria-label="Loader 1.25rem"/><LoaderIcon size="1.5rem" aria-label="Loader 1.5rem"/></div>};
