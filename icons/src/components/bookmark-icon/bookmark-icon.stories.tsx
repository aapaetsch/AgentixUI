// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkIcon } from "./index";
const meta={title:"Icons/Files/Bookmark",component:BookmarkIcon,args:{"aria-label":"Bookmark"},tags:["autodocs"]} satisfies Meta<typeof BookmarkIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><BookmarkIcon size="0.875rem" aria-label="Bookmark 0.875rem"/><BookmarkIcon size="1rem" aria-label="Bookmark 1rem"/><BookmarkIcon size="1.25rem" aria-label="Bookmark 1.25rem"/><BookmarkIcon size="1.5rem" aria-label="Bookmark 1.5rem"/></div>};
