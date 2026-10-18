// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PanelLeftIcon } from "./index";
const meta={title:"Icons/Navigation/Panel Left",component:PanelLeftIcon,args:{"aria-label":"Panel Left"},tags:["autodocs"]} satisfies Meta<typeof PanelLeftIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PanelLeftIcon size="0.875rem" aria-label="Panel Left 0.875rem"/><PanelLeftIcon size="1rem" aria-label="Panel Left 1rem"/><PanelLeftIcon size="1.25rem" aria-label="Panel Left 1.25rem"/><PanelLeftIcon size="1.5rem" aria-label="Panel Left 1.5rem"/></div>};
