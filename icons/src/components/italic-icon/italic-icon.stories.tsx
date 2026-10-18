// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ItalicIcon } from "./index";
const meta={title:"Icons/Actions/Italic",component:ItalicIcon,args:{"aria-label":"Italic"},tags:["autodocs"]} satisfies Meta<typeof ItalicIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ItalicIcon size="0.875rem" aria-label="Italic 0.875rem"/><ItalicIcon size="1rem" aria-label="Italic 1rem"/><ItalicIcon size="1.25rem" aria-label="Italic 1.25rem"/><ItalicIcon size="1.5rem" aria-label="Italic 1.5rem"/></div>};
