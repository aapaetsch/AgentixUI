// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkCheckIcon } from "./index";
const meta={title:"Icons/Files/Bookmark Check",component:BookmarkCheckIcon,args:{"aria-label":"Bookmark Check"},tags:["autodocs"]} satisfies Meta<typeof BookmarkCheckIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><BookmarkCheckIcon size="0.875rem" aria-label="Bookmark Check 0.875rem"/><BookmarkCheckIcon size="1rem" aria-label="Bookmark Check 1rem"/><BookmarkCheckIcon size="1.25rem" aria-label="Bookmark Check 1.25rem"/><BookmarkCheckIcon size="1.5rem" aria-label="Bookmark Check 1.5rem"/></div>};
