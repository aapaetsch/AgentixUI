// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PanelRightIcon } from "./index";
const meta={title:"Icons/Navigation/Panel Right",component:PanelRightIcon,args:{"aria-label":"Panel Right"},tags:["autodocs"]} satisfies Meta<typeof PanelRightIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PanelRightIcon size="0.875rem" aria-label="Panel Right 0.875rem"/><PanelRightIcon size="1rem" aria-label="Panel Right 1rem"/><PanelRightIcon size="1.25rem" aria-label="Panel Right 1.25rem"/><PanelRightIcon size="1.5rem" aria-label="Panel Right 1.5rem"/></div>};
