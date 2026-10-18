// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { UndoIcon } from "./index";
const meta={title:"Icons/Actions/Undo",component:UndoIcon,args:{"aria-label":"Undo"},tags:["autodocs"]} satisfies Meta<typeof UndoIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><UndoIcon size="0.875rem" aria-label="Undo 0.875rem"/><UndoIcon size="1rem" aria-label="Undo 1rem"/><UndoIcon size="1.25rem" aria-label="Undo 1.25rem"/><UndoIcon size="1.5rem" aria-label="Undo 1.5rem"/></div>};
