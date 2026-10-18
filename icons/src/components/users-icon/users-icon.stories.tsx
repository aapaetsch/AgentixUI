// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { UsersIcon } from "./index";
const meta={title:"Icons/Identity/Users",component:UsersIcon,args:{"aria-label":"Users"},tags:["autodocs"]} satisfies Meta<typeof UsersIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><UsersIcon size="0.875rem" aria-label="Users 0.875rem"/><UsersIcon size="1rem" aria-label="Users 1rem"/><UsersIcon size="1.25rem" aria-label="Users 1.25rem"/><UsersIcon size="1.5rem" aria-label="Users 1.5rem"/></div>};
