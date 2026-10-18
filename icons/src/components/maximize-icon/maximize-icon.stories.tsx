// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MaximizeIcon } from "./index";
const meta={title:"Icons/Layout/Maximize",component:MaximizeIcon,args:{"aria-label":"Maximize"},tags:["autodocs"]} satisfies Meta<typeof MaximizeIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MaximizeIcon size="0.875rem" aria-label="Maximize 0.875rem"/><MaximizeIcon size="1rem" aria-label="Maximize 1rem"/><MaximizeIcon size="1.25rem" aria-label="Maximize 1.25rem"/><MaximizeIcon size="1.5rem" aria-label="Maximize 1.5rem"/></div>};
