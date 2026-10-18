// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { NewspaperIcon } from "./index";
const meta={title:"Icons/Actions/Newspaper",component:NewspaperIcon,args:{"aria-label":"Newspaper"},tags:["autodocs"]} satisfies Meta<typeof NewspaperIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><NewspaperIcon size="0.875rem" aria-label="Newspaper 0.875rem"/><NewspaperIcon size="1rem" aria-label="Newspaper 1rem"/><NewspaperIcon size="1.25rem" aria-label="Newspaper 1.25rem"/><NewspaperIcon size="1.5rem" aria-label="Newspaper 1.5rem"/></div>};
